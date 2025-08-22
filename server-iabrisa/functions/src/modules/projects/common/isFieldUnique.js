const FirebaseService = require("../../../config/firebase");
const adminSdk = new FirebaseService();

const isFieldUnique = async (fieldName, value) => {
  const dbRef = adminSdk.dbProjects().where(fieldName, "==", value);
  return await dbRef.get().then(doc => doc.size === 0);
};

module.exports = isFieldUnique;
