# PROYECTO 3 ACAMICA - DELILAH RESTO


# DOCUMENTACION:
El archivo "spec.yaml" contiene la documentacion sobre request y response de la API.

# BASE DE DATOS:
El archivo "delilah_resto.sql" contiene todo lo necesario para crear la base de datos, tablas, relaciones y algunos datos precargados necesarios para su uso.

# DEPENDENCIAS:
Se deberan instalar las siguientes dependencias, se observan tambien en "package.json":
  - express
  - jsonwebtoken
  - mysql2
  - nodemon
  - sequilize

# SERVIDOR: 
El archivo "api.js" posee la confifiguracion del servidor el cual correra por el puerto 3000. El archivo "conexion.js" posee la configuracion de sequelize y la ruta a donde se alojara la BD que se genere con la informacion del archivo SQL

# POSTMAN:
En el archivo "Delilah Resto.postman_collection.json" se encuentran configurados y listos para utilizar los endpoints creados.  

# ENDPOINTS:
Usuario: 
  - post    => /usuarios
  - post    => /usuarios/login
  - get     => /clientes/:user_id

Productos:
  - post    => /productos
  - get     => /productos
  - patch   => /productos/:product_id
  - delete  => /productos/:product_id

Pedidos
  - post    => /pedidos
  - get     => /pedidos/:order_id
  - patch   => /pedidos/:order_id
  - delete  => /pedidos/:order_id