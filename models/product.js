const { DataTypes } = require('sequelize');


function product(sequelize) {
    const attributes = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 30],
                    msg: "product name must range between 3 to 30 characters"
                }
            }
        },
        description: { type: DataTypes.STRING, allowNull: true },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: { args: 1, msg: "product price cannot be zero or less than zero" },
                isNumeric: {
                    args: true,
                    msg: "product price must be a valid number"
                }
            }
        },
    };

    const options = {
        timestamps: true
    };

    return sequelize.define('product', attributes, options);
}

module.exports = product;