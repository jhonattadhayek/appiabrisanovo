const FirebaseService = require("../firebase");
const adminSdk = new FirebaseService();
const clientSdk = new FirebaseService("client");
const stream = require("stream");
const { v4: uuidv4 } = require("uuid");

exports.bucket = {
  upload: async ({ file, pathname }) => {
    const bucket = adminSdk.bucket();

    const base64EncodedFileString = file.replace(/^data:.*;base64,/, "");

    const mimeTypeMatch = file.match(
      /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
    );
    const mimeType = mimeTypeMatch
      ? mimeTypeMatch[1]
      : "application/octet-stream";

    const fileBuffer = Buffer.from(base64EncodedFileString, "base64");
    const bufferStream = new stream.PassThrough();

    bufferStream.end(fileBuffer);

    const fileBucket = bucket.file(pathname);

    const uuidToken = uuidv4();

    const config = {
      public: false,
      validation: "md5",
      metadata: {
        contentType: mimeType,
        metadata: {
          firebaseStorageDownloadTokens: uuidToken
        }
      }
    };

    return await new Promise(function (resolve, reject) {
      bufferStream
        .pipe(fileBucket.createWriteStream(config))
        .on("error", reject)
        .on("finish", async function () {
          const storageRef = clientSdk.storage().ref(pathname);

          return await storageRef.getDownloadURL().then(downloadURL => {
            resolve(downloadURL);
          });
        });
    });
  },

  delete: async pathname => {
    const bucket = adminSdk.bucket();
    const fileBucket = bucket.file(pathname);

    try {
      await fileBucket.delete();
      console.log(`Arquivo ${pathname} excluído com sucesso.`);
    } catch (error) {
      console.error(`Erro ao excluir o arquivo ${pathname}:`, error);
      throw new Error(`Erro ao excluir o arquivo ${pathname}.`);
    }
  }
};
