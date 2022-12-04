const { db } = require("../config/mysql");
const { returnSequelizeValidationErrors } = require('../helper');
//-------------------------------------------------------------------------------------------------
exports.getAllWarehouses = async (req, res, next) => {
    try {
        const warehouses = await db.Warehouse.findAll();
        res.status(200).json({
            status: "success",
            colSize: warehouses.length,
            data: warehouses
        });
    } catch (e) {
        res.status(500).json({
            status: "fail",
        });
    }
};
//-------------------------------------------------------------------------------------------------
exports.getOneWarehouse = async (req, res, next) => {
    try {
        const warehouse = await db.Warehouse.findByPk(req.params.id);
        if (!warehouse)
            res.status(404).json({
                status: "fail",
                message: `warehouse with id=${req.params.id} is not exist`
            });
        else
            res.status(200).json({
                status: "success",
                data: warehouse
            });
    } catch (e) {
        res.status(500).json({
            status: "fail",
        });
    }
};
//-------------------------------------------------------------------------------------------------
exports.createWarehouse = async (req, res, next) => {
    try {
        const warehouse = await db.Warehouse.create(req.body);
        res.status(201).json({
            status: "success",
            data: warehouse.toJSON()
        })
    } catch (e) {
        if (e.name === "SequelizeValidationError")
            return returnSequelizeValidationErrors(e, res);
        else
            res.status(500).json({
                status: "fail",
            });
    }
};
//-------------------------------------------------------------------------------------------------
exports.updateWarehouse = async (req, res, next) => {
    try {
        const warehouse = await db.Warehouse.update(req.body, { where: { id: req.params.id } });
        if (warehouse[0] === 0)
            res.status(404).json({
                status: "fail",
                message: `warehouse with id=${req.params.id} is not exist`
            });
        else
            return this.getOneWarehouse(req, res, next)
    } catch (e) {
        if (e.name === "SequelizeValidationError")
            return returnSequelizeValidationErrors(e, res);
        else
            res.status(500).json({
                status: "fail",
            });
    }
};
//-------------------------------------------------------------------------------------------------
exports.deleteWarehouse = async (req, res, next) => {

    try {
        const warehouse = await db.Warehouse.findByPk(req.params.id);
        if (!warehouse) {
            res.status(404).json({
                status: "fail",
                message: `warehouse with id=${req.params.id} is not exist`
            });
        }
        else {
            await db.Warehouse.destroy({ where: { id: req.params.id } });
            //automatically delete data in junction table related to this warehouse
            res.status(200).json({
                status: "success",
                message: `warehouse with id=${req.params.id} is deleted`
            });

        }
    } catch (e) {
        res.status(500).json({
            status: "fail",
        });
    }
};
//-------------------------------------------------------------------------------------------------
exports.addProductToWarehouse = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const warehouse = await db.Warehouse.findByPk(req.params.id);
        if (!warehouse) {
            return res.status(404).json({
                status: "fail",
                message: `warehouse with id=${req.params.id} is not exist`
            });
        }
        const product = await db.Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                status: "fail",
                message: `product with id=${productId} is not exist`
            });
        }
        const result = await db.ProductWarehouse.findOrCreate({
            where: {
                warehouseId: req.params.id,
                productId
            }
        });

        const [data, created] = result;
        if (created) { //new record
            await db.ProductWarehouse.update({ quantity: quantity }, {
                where: {
                    warehouseId: req.params.id,
                    productId
                }
            })
            res.status(200).json({
                status: "success",
                message: `product with id=${productId} added to warehouse successfully`
            })

        }
        else {
            const updatdQuantity = quantity + data.quantity;
            // console.log(updatdQuantity);
            await db.ProductWarehouse.update({ quantity: updatdQuantity }, {
                where: {
                    warehouseId: req.params.id,
                    productId
                }
            })
            res.status(200).json({
                status: "success",
                message: `product with id=${productId} added to warehouse successfully, current quatity=${updatdQuantity}`
            })
        }

    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: "fail",
        });
    }
}
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------