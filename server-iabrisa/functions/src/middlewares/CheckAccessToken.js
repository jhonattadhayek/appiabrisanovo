const FirebaseService = require("../config/firebase");
const adminSdk = new FirebaseService();

const JWT = require("jsonwebtoken");

exports.CheckAccessToken = async (request, response, next) => {
  try {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      return response.status(401).json({
        message: "O token de acesso é obrigatório"
      });
    }

    const token = authorizationHeader.split(" ")[1];
    const secret = "129679d5-efb6-49c1-bdf2-88626c20deef";

    JWT.verify(token, secret, async (error, decoded) => {
      if (error) {
        return response.status(401).json({
          message: "O token de acesso é inválido"
        });
      }

      try {
        const authRef = adminSdk.dbUsers().doc(decoded.sub);
        const doc = await authRef.get();

        if (!doc.exists) {
          return response.status(401).json({
            message: "A sessão foi expirada. Faça login novamente"
          });
        }

        const userData = { ...doc.data(), id: doc.id };

        if (!userData.actived) {
          return response.status(401).json({
            message: "A conta está desativada temporariamente"
          });
        }

        request.currentUser = userData;
        return next();
      } catch (dbError) {
        return response.status(503).json({
          message: "Erro ao acessar os dados do usuário"
        });
      }
    });
  } catch (error) {
    return response.status(503).json({
      message: error.message || "Erro interno do servidor"
    });
  }
};

exports.CheckAccessTokenAdmin = async (request, response, next) => {
  try {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      return response.status(401).json({
        message: "O token de acesso é obrigatório"
      });
    }

    const token = authorizationHeader.split(" ")[1];
    const secret = "129679d5-efb6-49c1-bdf2-88626c20deef";

    JWT.verify(token, secret, async (error, decoded) => {
      if (error) {
        return response.status(401).json({
          message: "O token de acesso é inválido"
        });
      }

      try {
        const authRef = adminSdk.dbAdmins().doc(decoded.sub);
        const doc = await authRef.get();

        if (!doc.exists) {
          return response.status(401).json({
            message: "A sessão foi expirada. Faça login novamente"
          });
        }

        const userData = { ...doc.data(), id: doc.id };

        if (!userData.actived) {
          return response.status(401).json({
            message: "A conta está desativada temporariamente"
          });
        }

        request.currentUser = userData;
        return next();
      } catch (dbError) {
        return response.status(503).json({
          message: "Erro ao acessar os dados do usuário"
        });
      }
    });
  } catch (error) {
    return response.status(503).json({
      message: error.message || "Erro interno do servidor"
    });
  }
};
