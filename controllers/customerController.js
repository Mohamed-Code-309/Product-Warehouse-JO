const { db } = require("../config/mysql");
const { returnSequelizeValidationErrors, returnEmailValidationError } = require('../helper');
//-------------------------------------------------------------------------------------------------
exports.getAllCustomers = async (req, res, next) => {
    try {
        const customers = await db.Customer.findAll();
        res.status(200).json({
            status: "success",
            colSize: customers.length,
            data: customers
        });
    } catch (e) {
        res.status(500).json({
            status: "fail",
        });
    }
};
//-------------------------------------------------------------------------------------------------
exports.getOneCustomer = async (req, res, next) => {
    try {
        const customer = await db.Customer.findByPk(req.params.id);
        if (!customer)
            res.status(404).json({
                status: "fail",
                message: `customer with id=${req.params.id} is not exist`
            });
        else
            res.status(200).json({
                status: "success",
                data: customer
            });
    } catch (e) {
        res.status(500).json({
            status: "fail",
        });
    }
};
//-------------------------------------------------------------------------------------------------
exports.createCustomer = async (req, res, next) => {
    try {
        const customer = await db.Customer.create(req.body);
        res.status(201).json({
            status: "success",
            data: customer.toJSON()
        })
    } catch (e) {
        if (e.name === "SequelizeValidationError")
            return returnSequelizeValidationErrors(e, res);
        else if (e.name === "SequelizeUniqueConstraintError")
            return returnEmailValidationError(res, req.body.email);
        else
            res.status(500).json({
                status: "fail",
            });
    }
};
//-------------------------------------------------------------------------------------------------
exports.updateCustomer = async (req, res, next) => {
    try {
        const customer = await db.Customer.update(req.body, { where: { id: req.params.id } });
        if (customer[0] === 0)
            res.status(404).json({
                status: "fail",
                message: `customer with id=${req.params.id} is not exist`
            });
        else
            return this.getOneCustomer(req, res, next)
    } catch (e) {
        if (e.name === "SequelizeUniqueConstraintError")
            return returnEmailValidationError(res, req.body.email);
        else
            res.status(500).json({
                status: "fail",
            });
    }
};
//-------------------------------------------------------------------------------------------------
exports.deleteCustomer = async (req, res, next) => {
    try {
        const customer = await db.Customer.findByPk(req.params.id);
        if (!customer) {
            res.status(404).json({
                status: "fail",
                message: `customer with id=${req.params.id} is not exist`
            });
        }
        else {
            await db.Customer.destroy({ where: { id: req.params.id } });
            res.status(200).json({
                status: "success",
                message: `customer with id=${req.params.id} is deleted`
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