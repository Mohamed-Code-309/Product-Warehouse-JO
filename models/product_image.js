const { DataTypes } = require('sequelize');


function product_image(sequelize) {
    const attributes = {
        url: { type: DataTypes.STRING, allowNull: false,
            validate: {
                notEmpty: {
                    args: false,
                    msg: "product image url cannot be empty string"
                },
                isUrl: {
                    args: true,
                    msg: "image url is not a valid url"
                }
            }
        },
        isDefault: { type: DataTypes.BOOLEAN, defaultValue: true },
    };

    const options = {};

    return sequelize.define('product_image', attributes, options);
}

module.exports = product_image;