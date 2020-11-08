const express = require("express");
const app = express();
const {
  validateUserData,
  validateProductData,
  validateOrderData,
  validacionJWT,
  validacionJWTAdmin,
} = require("./middlewares");
const { createUser, logIn, getUser } = require("./user");
const { createProduct, getProduct, updateProduct, deleteProduct } = require("./product");
const { createOrder, getOrder, updateOrder, deleteOrder } = require("./order");

app.use(express.json());

app.listen(3000, () => {
  console.log("Servidor en puerto 3000");
});

// USUARIOS
app.post("/usuarios", validateUserData, createUser); // CREACION DE USUARIO
app.post("/usuarios/login", logIn); // LOGUEO DE USUARIO
app.get("/usuarios/:user_id", validacionJWT, getUser); // LISTAR DATOS DE UN USUARIO ESPECIFICO

// PRODUCTOS
app.post("/productos", validateProductData, validacionJWTAdmin, createProduct); // CREACION DE PRODUCTO
app.get("/productos", validacionJWT, getProduct); // TRAER TODOS LOS PRODUCTOS
app.patch("/productos/:product_id", validacionJWTAdmin, updateProduct); // MODIFICAR UN PRODUCTO
app.delete("/productos/:product_id", validacionJWTAdmin, deleteProduct); // ELIMINAR UN PRODUCTO

// PEDIDOS
app.post("/pedidos", validateOrderData, validacionJWT, createOrder); // CREACION DE PEDIDO
app.get("/pedidos/:order_id", validacionJWT, getOrder); // TRAER UN PEDIDO
app.patch("/pedidos/:order_id", validacionJWTAdmin, updateOrder); // MODIFICAR UN PEDIDO
app.delete("/pedidos/:order_id", validacionJWTAdmin, deleteOrder); // ELIMINAR UN PEDIDO
