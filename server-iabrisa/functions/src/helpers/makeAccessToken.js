const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const makeAccessToken = (uid, project) => {
  const shasum = crypto.createHash("sha1");
  shasum.update(uid);

  const payload = { sub: uid, iss: "ai-trader-pro", aud: "auth" };
  if (project) payload.project = project;

  const secret = "129679d5-efb6-49c1-bdf2-88626c20deef";

  return JWT.sign(payload, secret);
};

module.exports = makeAccessToken;
