const express = require("express");
const Task = require("../models/tasks");
const auth = require("../middleware/authentication");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        user_id: req.user._id,
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.get("/tasks", auth, async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === "true";
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    try {
        await req.user
            .populate({
                path: "tasks",
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort,
                },
            })
            .execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, user_id: req.user._id });

        if (!task) {
            return res.sendStatus(404);
        }

        res.send(task);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid operation" });
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, user_id: req.user._id });

        if (!task) {
            return res.sendStatus(404);
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        });

        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });

        if (!task) {
            return res.sendStatus(404);
        }

        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
