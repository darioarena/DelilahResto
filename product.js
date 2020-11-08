const sequelize = require("./conexion.js");

module.exports = {
  createProduct: async (req, res) => {
    const { name, price, img_url } = req.body;
    const active = 1;
    try {
      const productExistente = await sequelize.query("SELECT name FROM product WHERE name=?", {
        replacements: [name],
        type: sequelize.QueryTypes.SELECT,
      });
      if (productExistente == 0) {
        try {
          const data = await sequelize.query("INSERT INTO product (name, price, img_url, active) VALUES (?,?,?,?)", {
            replacements: [name, price, img_url, active],
            type: sequelize.QueryTypes.INSERT,
          });
          console.log(data);
          res.status(201).json({"msj":"Producto creado exitosamente"});
        } catch (err) {
          console.log("error" + err);
        }
      } else {
        res.status(400).json({"msj":"Producto existente, por favor ingrese otro nombre"});
      }
    } catch (err) {
      console.log("error" + err);
    }
  },
  getProduct: async (req, res) => {
    try {
      const dataGetProduct = await sequelize.query(
        "SELECT product_id, name, price, img_url FROM product WHERE active=1",
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      res.status(200).json(dataGetProduct);
    } catch (err) {
      console.log("error" + err);
    }
  },
  updateProduct: async (req, res) => {
    const { price, img_url } = req.body;
    const productId = req.params.product_id;
    try {
      const productExistente = await sequelize.query("SELECT product_id FROM product WHERE product_id=?", {
        replacements: [productId],
        type: sequelize.QueryTypes.SELECT,
      });
      if (productExistente.length != 0) {
        if (price && img_url) {
          try {
            const data = await sequelize.query("UPDATE product SET price=?, img_url=? WHERE product_id=?", {
              replacements: [price, img_url, productId],
              type: sequelize.QueryTypes.UPDATE,
            });
            console.log(data);
            res.status(200).json({"msj":"Producto modificado exitosamente"});
          } catch (err) {
            console.log("error" + err);
          }
        } else {
          res.status(400).json({"msj":"Todos los campos deben estar completos"});
        }
      } else {
        res.status(400).json({"msj":"Id erroneo - No se encuentra en Base de Datos"});
      }
    } catch (err) {
      console.log("error" + err);
    }
  },
  deleteProduct: async (req, res) => {
    const productId = req.params.product_id;
    const active = 0;
    try {
      const productExistente = await sequelize.query("SELECT product_id FROM product WHERE product_id=?", {
        replacements: [productId],
        type: sequelize.QueryTypes.SELECT,
      });
      if (productExistente.length != 0) {
        try {
          const data = await sequelize.query("UPDATE product SET active=? WHERE product_id=?", {
            replacements: [active, productId],
            type: sequelize.QueryTypes.UPDATE,
          });
          res.status(200).json({"msj":"Producto desactivado exitosamente"});
        } catch (err) {
          console.log("error" + err);
        }
      } else {
        res.status(400).json({"msj":"Id erroneo - No se encuentra en Base de Datos"});
      }
    } catch (err) {
      console.log("error" + err);
    }
  },
};
