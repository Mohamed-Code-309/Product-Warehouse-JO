const { DataTypes } = require('sequelize');


function customer(sequelize) {
    const attributes = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 30],
                    msg: "customer name must range between 2 to 30 characters"
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "cutomer email must be a valid email address",
                }
            }
        },
        phone: { type: DataTypes.STRING, allowNull: false },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { args: true, msg: "warehouse city cannot be an empty string" }
            }
        },
        lat: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { isNumeric: { msg: "latitude must be a valid number" } }
        },
        long: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { isNumeric: { msg: "latitude must be a valid number" } }
        }
    };

    const options = {
        timestamps: true
    };

    return sequelize.define('customer', attributes, options);
}

module.exports = customer;