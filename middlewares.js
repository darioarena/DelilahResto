const jwt = require("jsonwebtoken");
const tokenKey = "keyParaEncriptacionJWToken";

module.exports = {
  validateUserData: (req, res, next) => {
    if (req.body.email && req.body.fullname && req.body.phone && req.body.address && req.body.pass) {
      next();
    } else {
      res.status(400).json({"msj":"Todos los campos deben estar completos"});
    }
  },
  validateProductData: (req, res, next) => {
    if (req.body.name && req.body.price && req.body.img_url) {
      next();
    } else {
      res.status(400).json({"msj":"Todos los campos deben estar completos"});
    }
  },
  validateOrderData: (req, res, next) => {
    if (req.body.total && req.body.pay_method_id && req.body.items) {
      next();
    } else {
      res.status(400).json({"msj":"Todos los campos deben estar completos"});
    }
  },
  validacionJWT: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const verificarToken = jwt.verify(token, tokenKey);
      if (verificarToken) {
        req.infoToken = verificarToken;
        return next();
      }
    } catch (error) {
      res.status(401).json({"msj":"Error al validar usuario"});
    }
  },
  validacionJWTAdmin: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const verificarToken = jwt.verify(token, tokenKey);
      if (verificarToken) {
        req.infoToken = verificarToken;
        if (req.infoToken.admin == true) {
          return next();
        } else {
          res.status(401).json({"msj":"Solo acceso Administrador"});
        }
      }
    } catch (error) {
      res.status(401).json({"msj":"Error al validar usuario"});
    }
  },
};
