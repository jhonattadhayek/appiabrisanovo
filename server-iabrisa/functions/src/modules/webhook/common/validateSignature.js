const FirebaseService = require("../../../config/firebase");
const adminSdk = new FirebaseService();

const normalizeStatus = (platform, body) => {
  const fieldMap = {
    kirvano: "status",
    perfect: "sale_status_enum",
    lastlink: "Event"
  };

  const statusMap = {
    aproved: [
      "APPROVED", // kirvano
      "Purchase_Order_Confirmed", // lastlink
      2 // perfect
    ],
    canceled: [
      "CHARGEBACK", // kirvano
      "REFUNDED", // kirvano
      "REFUSED", // kirvano
      "Payment_Refund", // lastlink
      "Payment_Chargeback", // lastlink
      4, // perfect
      7, // perfect
      9 // perfect
    ]
  };

  const field = fieldMap[platform];
  if (!field) {
    throw new Error(`Unknown platform: ${platform}`);
  }

  const rawStatus = body[field];
  if (!rawStatus) {
    throw new Error(`Missing status field: ${field}`);
  }

  const normalizedStatus = Object.keys(statusMap).find(key => {
    return statusMap[key].includes(rawStatus);
  });

  return normalizedStatus || "unknown";
};

const validateSignature = async (projectId, platform, body) => {
  if (!projectId || !body || !platform) {
    throw new Error("Invalid input: missing required fields");
  }

  const { customer } = body;
  const status = normalizeStatus(platform, body);
  if (status === "unknown") return false;

  const usersRef = adminSdk.dbUsers();

  let email = customer.email;

  if (body?.Data?.Buyer?.Email) {
    email = body.Data.Buyer.Email;
  }

  try {
    const data = await usersRef
      .where("email", "==", email)
      .where("projectId", "==", projectId)
      .get();

    const users = data.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));

    if (users.length) {
      const promises = users.map(async user => {
        const dbRef = usersRef.doc(user.id);

        const updateData = {
          actived: status !== "canceled",
          signature: status === "aproved" ? "paid" : "free"
        };

        if (status === "aproved") {
          updateData.payment = {
            dateAt: Date.now(),
            platform: platform
          };
        }

        return await dbRef.update(updateData);
      });

      await Promise.all(promises);
    } else if (status === "aproved") {
      const newUser = {
        createdAt: Date.now(),
        email,
        projectId,
        actived: true,
        signature: "paid",
        payment: {
          dateAt: Date.now(),
          platform: platform
        }
      };

      await usersRef.add(newUser);
    }

    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error(`Database operation failed: ${error.message}`);
  }
};

module.exports = validateSignature;
