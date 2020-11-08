const sequelize = require("./conexion.js");
const jwt = require("jsonwebtoken");
const tokenKey = "keyParaEncriptacionJWToken";

module.exports = {
  createUser: async (req, res) => {
    const { email, fullname, phone, address, pass } = req.body;
    const admin = req.body.admin ? req.body.admin : 0;
    try {
      const userExistente = await sequelize.query("SELECT email FROM user WHERE email=?", {
        replacements: [email],
        type: sequelize.QueryTypes.SELECT,
      });
      if (userExistente.length == 0) {
        try {
          const data = await sequelize.query(
            "INSERT INTO user (email,fullname,phone,address,pass,admin) VALUES (?,?,?,?,?,?)",
            {
              replacements: [email, fullname, phone, address, pass, admin],
              type: sequelize.QueryTypes.INSERT,
            }
          );
          res.status(201).json({"msj":"Usuario creado exitosamente"});
        } catch (err) {
          console.log("error" + err);
        }
      } else {
        res.status(400).json({"msj":"Usuario existente - Correo registrado"});
      }
    } catch (err) {
      console.log("error" + err);
    }
  },
  logIn: async (req, res) => {
    const { email, pass } = req.body;
    try {
      const data = await sequelize.query("SELECT * FROM user WHERE email=? AND pass=?", {
        replacements: [email, pass],
        type: sequelize.QueryTypes.SELECT,
      });

      if (data.length == 0) {
        res.status(401).json({"msj":"Error en LogIn"});
      } else {
        const dataToken = {
          user_id: data[0].user_id,
          email: data[0].email,
          fullname: data[0].fullname,
          admin: data[0].admin,
        };
        infoToken = jwt.sign(dataToken, tokenKey, { expiresIn: "1h" });
        console.log(infoToken);
        res.status(200).json({"msj":"Usuario logueado exitosamente","token":infoToken});
      }
    } catch (err) {
      console.log("error" + err);
    }
  },
  getUser: async (req, res) => {
    const userId = req.params.user_id;
    const userExistente = await sequelize.query("SELECT user_id FROM user WHERE user_id=?", {
      replacements: [userId],
      type: sequelize.QueryTypes.SELECT,
    });
    try {
      if (userExistente.length !== 0) {
        if (req.infoToken.user_id == userId) {
          const dataGetUser = await sequelize.query("SELECT user_id,email,fullname,phone,address FROM user WHERE user_id=?", {
            replacements: [userId],
            type: sequelize.QueryTypes.SELECT,
          });
          res.status(200).json(dataGetUser);
        } else {
          res.status(401).json({"msj":"No posee autorizacion suficiente"});
        }
      } else {
        res.status(400).json({"msj":"Id erroneo - No se encuentra en Base de Datos"});
      }
    } catch (err) {
      console.log("error" + err);
    }
  },
};
