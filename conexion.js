const Sequelize = require('sequelize');
const path = 'mysql://root@localhost:3306/delilah_resto';
const sequelize = new Sequelize(path, {operatorsAliases:0});

sequelize.authenticate().then(()=>{
    console.log('DB connected');
}).catch(err =>{
    console.log('Error ',err);
});

module.exports = sequelize;