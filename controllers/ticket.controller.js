const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const constants = require("../utils/constant");
const objectConverter = require("../utils/objectConverter");

exports.createTicket = async (req, res) => {
    const ticketObject = {
        title: req.body.title,
        ticketPriority: req.body.priority,
        description: req.body.description,
        status: req.body.status,
        reporter: req.body.userId
    }
    const engineer = await User.findOne({
        userType: constants.userTypes.engineer,
        userStatus: constants.userStatus.approved
    })
    ticketObject.assignee = engineer.userId;
    try{
        const ticket = await Ticket.create(ticketObject);
        if(ticket){
            const user = await User.findOne({
                userId: req.body.userId
            })
            user.ticketCreated.push(ticket._id);
            await user.save();
            engineer.tiketAssigned.push(ticket._id);
            await engineer.save();
            res.status(201).send(objectConverter.ticketResponse(ticket))
        }
    }catch(err){
        console.log("Some error happened while creating ticket", err.message);
        res.status(500).send({
            message: "Some internal server error"
        })
    }
}

const canUpdate = (user, ticket) => {
    return user.userId == ticket.reporter ||
           user.userId == ticket.assignee || 
           user.userType == constants.userTypes.admin
}

exports.updateTicket = async (req, res) => {
    const ticket = await Ticket.findOne({
        _id: req.params.id,
    });
    const savedUser = await User.findOne({
        userId: req.body.userId
    });
    if(canUpdate(savedUser, ticket)){
        ticket.title = req.body.title !== undefined? req.body.title:ticket.title
        ticket.description = req.body.description !== undefined ? req.body.description: ticket.description
        ticket.ticketPriority = req.body.ticketPriority !== undefined ? req.body.ticketPriority: ticket.ticketPriority
        ticket.status = req.body.status !== undefined ? req.body.status: ticket.status
        ticket.assignee = req.body.assignee !== undefined ? req.body.assignee: ticket.assignee
        await ticket.save()
        res.status(200).send(objectConverter.ticketResponse(ticket));
    }else{
        console.log("Tiket was being updated by someone without access.");
        res.status(401).send({
            message: "Ticket can be updated only by the cutomer who created it"
        })
    }
}

exports.getAllTickets = async (req, res) => {
    /**
     * Usecases :
     *  - ADMIN : Should get list of all tickets.
     *  - USER : should get the tickets created by him/her.
     *  - ENGINEER : should get the tickets created by him/her.
     */
    const queryObj = {};
    if(req.query.status !== undefined){
        queryObj.status = req.query.status
    }
    const savedUser = await User.findOne({userid : req.body.userId})
    if(savedUser.userType === constants.userTypes.admin){
        // Do anything
    } else if (savedUser.userType == constants.userTypes.customer){
        queryObj.reporter = savedUser.userId;
    } else {
        queryObj.assignee = savedUser.userId;
    }

    const tickets = await Ticket.find(queryObj);
    res.status(200).send(objectConverter.ticketListResponse(tickets));
}

exports.getOneTicket = async (req, res) => {
    const ticket = await Ticket.findOne({_id: req.params.id});
    res.status(200).send(objectConverter.ticketListResponse(ticket));
}