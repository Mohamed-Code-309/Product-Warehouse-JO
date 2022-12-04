const { DataTypes, ValidationError, ValidationErrorItem } = require('sequelize');
const bcrypt = require('bcrypt');

function user(sequelize) {
    const attributes = {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "user email must be a valid email address",
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            //validate doesn't work id set exist and ... 
            // validate: {
            //     checkLength(value) {
            //         if (value.length < 6) {
            //             throw new Error("Password Length must be 6 or greater!");
            //         }
            //     },
            // },
            set(value) {
                if (value.length < 6) {
                    throw new ValidationError("Password Length must be 6 or greater!",[
                        new ValidationErrorItem("Password Length must be 6 or greater!")
                    ])
                }
                const salt = bcrypt.genSaltSync(12);
                const hash = bcrypt.hashSync(value, salt);
                this.setDataValue('password', hash)
            }
        },
    };

    const options = {
        timestamps: true
    };

    return sequelize.define('user', attributes, options);
}

module.exports = user;