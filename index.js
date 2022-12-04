const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });
const { sequelize, initializeDatabase, initializeModels } = require("./config/mysql"); //MUST be AFTER dotenv

//-------------------------------------------------------------------------------------------
initializeDatabase();
sequelize.authenticate()
    .then(() => {
        console.log('connection successed');
        initializeModels(sequelize)
    })
    .catch((err) => {
        console.log(err);
        console.log("error connecting to the database!")
    })
//--------------------------------------------------------------------------------------------

const app = express();
app.use(express.json());

//restrict routes
const { authUser } = require('./middleware/auth');

//Routes...
app.use("/api/v1/products", require('./routes/productRoutes'));
app.use("/api/v1/customers", require('./routes/customerRoutes'));
app.use("/api/v1/users", require('./routes/userRoutes'));
app.use("/api/v1/warehouses", require('./routes/warehouseRoutes'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listen on : http://localhost:${PORT}`));