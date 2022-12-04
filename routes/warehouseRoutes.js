const express = require("express");
const warehouseController = require("../controllers/warehouseController");
const router = express.Router();
//-------------------------------------------------------------------------------------------------
router
    .route("/")
    .get(warehouseController.getAllWarehouses)
    .post(warehouseController.createWarehouse);
//-------------------------------------------------------------------------------------------------
router
    .route("/:id")
    .get(warehouseController.getOneWarehouse)
    .put(warehouseController.updateWarehouse)
    .delete(warehouseController.deleteWarehouse);
//-------------------------------------------------------------------------------------------------
router.route("/:id/add").post(warehouseController.addProductToWarehouse)
//-------------------------------------------------------------------------------------------------

module.exports = router;