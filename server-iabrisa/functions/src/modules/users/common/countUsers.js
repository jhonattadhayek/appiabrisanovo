const FirebaseService = require("../../../config/firebase");
const adminSdk = new FirebaseService();

const { FieldValue } = require("firebase-admin/firestore");

exports.countUsers = async projectId => {
  const projectsRef = adminSdk.dbProjects().doc(projectId);
  return await projectsRef.update({ numUsers: FieldValue.increment(1) });
};
