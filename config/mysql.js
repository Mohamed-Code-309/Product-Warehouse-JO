const mysql = require('mysql2/promise');
const { Sequelize, DataTypes } = require('sequelize');
//-------------------------------------------------------------------------------------------------
const sequelize = new Sequelize(
    process.env.MYSQL_SCHEMA,
    process.env.MYSQL_USERNAME,
    process.env.MYSQL_PASS, {
    dialect: 'mysql',
    define: {
        freezeTableName: true,
        timestamps: false
    }
});
//-------------------------------------------------------------------------------------------------
async function initializeDatabase() {

    //[1] create database if it doesn't already exist
    const connection = await mysql.createConnection({
        host: "localhost",
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASS
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_SCHEMA}\`;`);
}
//-------------------------------------------------------------------------------------------------

let db = {};
async function initializeModels(sequelize) {
    //[3] init models and add them to the db object
    db.Product = require('../models/product')(sequelize);
    db.Product_Image = require('../models/product_image')(sequelize);
    db.Customer = require('../models/customer')(sequelize);
    db.User = require('../models/user')(sequelize);
    db.Warehouse = require('../models/warehouse')(sequelize);



    //[4] establish relationships
    //product O===>M product_image (one-to-many)  
    db.Product.hasMany(db.Product_Image);
    db.Product_Image.belongsTo(db.Product);

    //warehouse M<===>M product
    //junction table
    const Product_Warehouse = sequelize.define('product_warehouse', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: {
            type: DataTypes.INTEGER,

        }
    }, { timestamps: false });
    
    db.Product.belongsToMany(db.Warehouse, { through: Product_Warehouse });
    db.Warehouse.belongsToMany(db.Product, { through: Product_Warehouse });
    db.ProductWarehouse = Product_Warehouse;
    //[5] sync all models with database
    await sequelize.sync();
}
//-------------------------------------------------------------------------------------------------

//initializeDatabase();
//initializeModels(sequelize);

module.exports = {
    db,
    sequelize,
    initializeDatabase,
    initializeModels
}

