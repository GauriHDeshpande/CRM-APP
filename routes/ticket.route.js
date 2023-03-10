const ticketController = require("../controllers/ticket.controller");
const {authJWT} = require("../middlewares/authjwt");


module.exports = function(app){
    app.post("/crm/api/tickets/", [authJWT.verifyToken], ticketController.createTicket);
    app.put("/crm/api/tickets/:id", [authJWT.verifyToken], ticketController.updateTicket);
    app.get("/crm/api/tickets", [authJWT.verifyToken], ticketController.getAllTickets);
    app.get("/crm/api/ticket/:id", [authJWT.verifyToken], ticketController.getOneTicket);
}