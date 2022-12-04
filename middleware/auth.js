const jwt = require("jsonwebtoken");
//-------------------------------------------------------------------------------------------------
async function authUser(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({ status: 401, message: "You need to sign in" })
        }
        let token = req.headers.authorization.split(' ')[1];
        if (token == 'null') {
            return res.status(401).send({ status: 401, message: "You need to sign in" })
        }

        let payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!payload) {
            return res.status(401).send({ status: 401, message: "You need to sign in" })
        }
        next();
    }
    catch (err) {
        //console.log(err.name);
        switch (err.name) {
            case "JsonWebTokenError":
                return res.status(406).send({ status: 406, message: "Invalid Token" });
            case "TokenExpiredError":
                return res.status(401).send({ status: 401, message: "JWT is expired" });
            default:
                return res.status(500).json({ status: 500, message: "internal server error" });
        }
    }
}
//-------------------------------------------------------------------------------------------------
module.exports = {
    authUser
}