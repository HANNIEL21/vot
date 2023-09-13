import express from "express";
import Poll from "../model/poll";

const PollRouter = express.Router();

PollRouter.get("/",(req, res) => {
    res.send("new poll");
});

PollRouter.post("/",(req, res) => {
    res.send("new poll");
});


PollRouter.post("/join",(req, res) => {
    res.send("new poll");
});


export default PollRouter;