const authJWT = require("../middlewares/authjwt");
const userController = require("../controllers/user.controller");


module.exports = function (app) {
    app.get('/crm/api/users/', [authJWT.verifyToken, authJWT.isAdmin], userController.findAll);
    app.get('/crm/api/users/:userId',
        [authJWT.verifyToken, authJWT.isAdmin],
        userController.findById
    )
    app.put('/crm/api/users/:userId',
        [authJWT.verifyToken, authJWT.isAdmin],
        userController.update
    )
}