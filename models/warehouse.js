const { DataTypes } = require('sequelize');


function warehouse(sequelize) {
    const attributes = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 30],
                    msg: "warehouse name must range between 3 to 30 characters"
                }
            }
        },
        description: { type: DataTypes.STRING, allowNull: true },
        city: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            validate: {
                notEmpty: {args: true, msg: "warehouse city cannot be an empty string"}
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

    return sequelize.define('warehouse', attributes, options);
}

module.exports = warehouse;