const { db } = require("../config/mysql");
const { returnSequelizeValidationErrors, returnEmailValidationError } = require('../helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const accessToken_Expire = "15d";
//-------------------------------------------------------------------------------------------------
exports.createUser = async (req, res, next) => {
    try {
        await db.User.create(req.body);
        res.status(201).json({
            status: "success",
            message: "user created successfully, login now!"
        });
    } catch (e) {
        console.log(JSON.stringify(e));
        if (e.name === "SequelizeValidationError")
            return returnSequelizeValidationErrors(e, res);
        if (e.name === "SequelizeUniqueConstraintError")
            return returnEmailValidationError(res, req.body.email);
        else
            res.status(500).json({
                status: "fail",
            });
    }
};
//-------------------------------------------------------------------------------------------------
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ status: 404, message: "user is not existed" });
        }
        const isCorrect = await bcrypt.compare(password, user.password);

        if (isCorrect) {
            const { id, email } = user;
            const token = jwt.sign({ id, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: accessToken_Expire });
            res.status(200).json({
                status: "success",
                token
            });
        } else {
            res.status(400).json({
                status: "fail",
                message: "incorrect email or password",
            });
        }
    }
    catch (e) {
        res.status(500).json({
            status: "fail",
        });
    }
};
//-------------------------------------------------------------------------------------------------
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await db.User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({
                status: "fail",
                message: `user with id=${req.params.id} is not exist`
            });
        }
        else {
            await db.User.destroy({ where: { id: req.params.id } });
            res.status(200).json({
                status: "success",
                message: `user with id=${req.params.id} is deleted`
            });
        }
    } catch (e) {
        res.status(500).json({
            status: "fail",
        });
    }
};
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
