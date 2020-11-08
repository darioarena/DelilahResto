const sequelize = require("./conexion.js");

module.exports = {
  createOrder: async (req, res) => {
    const { total, pay_method_id, items } = req.body;
    const status_id = 1;
    const active = 1;
    let productInvalid = false;
    try {
      const checkPayMethod = await sequelize.query("SELECT * FROM payment_method WHERE pay_method_id=?", {
        replacements: [pay_method_id],
        type: sequelize.QueryTypes.SELECT,
      });
      const checkProduct = await sequelize.query("SELECT product_id,active FROM product", {
        type: sequelize.QueryTypes.SELECT,
      });
      console.log(checkProduct);
      let checkProductArray = [];
      for (i = 0; i < checkProduct.length; i++) {
        if (checkProduct[i].active == 1) {
          checkProductArray.push(checkProduct[i].product_id);
        }
      }
      console.log(checkProductArray);
      items.forEach((items) => {
        console.log(items);
        if (checkProductArray.indexOf(items.product_id) == -1) {
          productInvalid = true;
          res.status(400).json({"msj":"Producto no encontrado"});
        }
      });
      if ((checkPayMethod.length && productInvalid == false)) {
        const data = await sequelize.query(
          "INSERT INTO orders (total,status_id,pay_method_id,user_id,active) VALUES (?,?,?,?,?)",
          {
            replacements: [total, status_id, pay_method_id, req.infoToken.user_id, active],
            type: sequelize.QueryTypes.INSERT,
          }
        );
        const orderId = await sequelize.query("SELECT MAX(order_id) FROM orders WHERE user_id=?", {
          replacements: [req.infoToken.user_id],
          type: sequelize.QueryTypes.SELECT,
        });
        const orderIdValue = Object.values(orderId[0].valueOf("MAX(id)"));
        items.forEach((items) => {
          sequelize.query("INSERT INTO product_order (order_id,product_id,quantity) VALUES (?,?,?)", {
            replacements: [orderIdValue, items.product_id, items.quantity],
            type: sequelize.QueryTypes.INSERT,
          });
        });
        if (!orderId) {
          res.status(400).json({"msj":"Error en los parametros de carga"});
        } else {
          console.log(data);
          res.status(201).json({"msj":"Pedido creado exitosamente"});
        }
      } else {
        res.status(400).json({"msj":"Error en metodo de pago o producto invalido"});
      }
    } catch (err) {
      console.log("error" + err);
    }
  },
  getOrder: async (req, res) => {
    const orderId = req.params.order_id;
    const orderExistente = await sequelize.query("SELECT * FROM orders WHERE order_id=?", {
      replacements: [orderId],
      type: sequelize.QueryTypes.SELECT,
    });
    if (orderExistente.length == 0) {
      res.status(400).json({"msj":"Id erroneo - No se encuentra en Base de Datos"});
    } else {
      if (req.infoToken.user_id == orderExistente[0].user_id && orderExistente[0].active == 1) {
        try {
          const dataGetOrder = await sequelize.query(
            "SELECT user.user_id,user.email,user.fullname,user.phone,user.address,orders.order_id,orders.total,status_order.status_name,payment_method.pay_method_name FROM orders INNER JOIN user ON orders.user_id=user.user_id INNER JOIN status_order ON orders.status_id=status_order.status_id INNER JOIN payment_method ON orders.pay_method_id=payment_method.pay_method_id  WHERE orders.order_id=?",
            {
              replacements: [orderId],
              type: sequelize.QueryTypes.SELECT,
            }
          );
          const dataGetItems = await sequelize.query(
            "SELECT product_order.product_id,product_order.quantity FROM product_order WHERE product_order.order_id=?",
            {
              replacements: [orderId],
              type: sequelize.QueryTypes.SELECT,
            }
          );
          orderAndItems = {
            pedidos: dataGetOrder,
            items: dataGetItems,
          };
          console.log(orderAndItems);
          res.status(200).json(orderAndItems);
        } catch (err) {
          console.log("error" + err);
        }
      } else {
        res.status(400).json({"msj":"No existe el pedido indicado activo para el usuario logueado"});
      }
    }
  },
  updateOrder: async (req, res) => {
    const { status_id } = req.body;
    const orderId = req.params.order_id;
    try {
      const orderExistente = await sequelize.query("SELECT order_id FROM orders WHERE order_id=?", {
        replacements: [orderId],
        type: sequelize.QueryTypes.SELECT,
      });
      if (orderExistente.length != 0) {
        if (status_id) {
          try {
            const data = await sequelize.query("UPDATE orders SET status_id=? WHERE order_id=?", {
              replacements: [status_id, orderId],
              type: sequelize.QueryTypes.UPDATE,
            });
            console.log(data);
            res.status(200).json({"msj":"Pedido modificado exitosamente"});
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
  deleteOrder: async (req, res) => {
    const orderId = req.params.order_id;
    const active = 0;
    try {
      const orderExistente = await sequelize.query("SELECT order_id FROM orders WHERE order_id=?", {
        replacements: [orderId],
        type: sequelize.QueryTypes.SELECT,
      });
      if (orderExistente.length != 0) {
        try {
          const data = await sequelize.query("UPDATE orders SET active=? WHERE order_id=?", {
            replacements: [active, orderId],
            type: sequelize.QueryTypes.UPDATE,
          });
          res.status(200).json({"msj":"Pedido desactivado exitosamente"});
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
