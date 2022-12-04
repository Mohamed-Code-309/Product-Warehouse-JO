const { db, sequelize } = require("../config/mysql");
const { returnSequelizeValidationErrors, returnAggregateErrors } = require('../helper');
//-------------------------------------------------------------------------------------------------

exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await db.Product.findAll();
        res.status(200).json({
            status: "success",
            colSize: products.length,
            data: products
        });
    } catch (e) {
        res.status(500).json({
            status: "fail",
        });
    }
};
//-------------------------------------------------------------------------------------------------
exports.getOneProduct = async (req, res, next) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product)
            res.status(404).json({
                status: "fail",
                message: `product with id=${req.params.id} is not exist`
            });
        else
            res.status(200).json({
                status: "success",
                data: product
            });
    } catch (e) {
        res.status(500).json({
            status: "fail",
        });
    }
};
//-------------------------------------------------------------------------------------------------
exports.createProduct = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const { images, ...productData } = req.body;
        const product = await db.Product.create(productData, { transaction: trans });
        if (images && Array.isArray(images) && images.length > 0) {
            const product_images = images.map(m => ({
                productId: product.id,
                url: m.url,
                isDefault: m.isDefault
            }))
            await db.Product_Image.bulkCreate(product_images, { validate: true, transaction: trans })
            await trans.commit();
            res.status(201).json({
                status: "success",
                data: product.toJSON()
            })
        }
        else {
            await trans.rollback();
            res.status(400).json({
                status: "fail",
                message: "product must have at least one image"
            });
        }
    } catch (e) {
        await trans.rollback();
        //console.log(JSON.stringify(e));
        if (e.name === "SequelizeValidationError")
            return returnSequelizeValidationErrors(e, res)
        else if (e.name === "AggregateError")
            return returnAggregateErrors(e, res);
        else
            res.status(500).json({
                status: "fail",
            });
    }
};
//-------------------------------------------------------------------------------------------------
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await db.Product.update(req.body, { where: { id: req.params.id } });
        if (product[0] === 0)
            res.status(404).json({
                status: "fail",
                message: `product with id=${req.params.id} is not exist`
            });
        else
            return this.getOneProduct(req, res, next)
    } catch (e) {
        if (e.name === "SequelizeValidationError")
            return returnSequelizeValidationErrors(e, res)
        else
            res.status(500).json({
                status: "fail",
            });
    }
};
//-------------------------------------------------------------------------------------------------
exports.deleteProduct = async (req, res, next) => {
    const trans = await sequelize.transaction();

    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product) {
            await trans.rollback();
            res.status(404).json({
                status: "fail",
                message: `product with id=${req.params.id} is not exist`
            });
        }
        else {
            //DELETE images first because delete product first will make productId in image table = null  
            await db.Product_Image.destroy({ where: { productId: req.params.id }, transaction: trans });
            await db.Product.destroy({ where: { id: req.params.id }, transaction: trans });
            await trans.commit();
            res.status(200).json({
                status: "success",
                message: `product with id=${req.params.id} is deleted`
            });

        }
    } catch (e) {
        await trans.rollback();
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