const functions = require("firebase-functions");

const FirebaseService = require("../config/firebase");
const adminSdk = new FirebaseService();

exports.countUsers = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    const getProjects = async () => {
      const dbRef = adminSdk
        .dbProjects()
        .where("format", "==", "app")
        .where("status", "==", "actived");

      const projects = await dbRef.get().then(snap => {
        if (snap.empty) return null;
        return snap.docs;
      });

      return projects.map(doc => Object.assign(doc.data(), { id: doc.id }));
    };

    const projects = await getProjects();

    await Promise.all(
      projects.map(async project => {
        const usersRef = adminSdk.dbUsers();
        const countRef = usersRef.where("projectId", "==", project.id).count();
        const numUsers = await countRef.get().then(doc => doc.data().count);

        adminSdk
          .dbProjects()
          .doc(project.id)
          .update({ numUsers: Number(numUsers) });
      })
    );

    return true;
  });
