const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const sequelize = new Sequelize("todolist", "root", "102030", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
});

sequelize.authenticate()
    .then(() => console.log("Database connected"))
    .catch(err => console.error("Error connecting to database:", err));

// Task Model
const Task = sequelize.define("Task", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
});

// Sync Database
sequelize.sync()
    .then(() => console.log("Tables created"))
    .catch(err => console.error("Error creating tables:", err));

// Routes
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.findAll();
        console.log("Tasks fetched successfully" + tasks);
        res.json(tasks);
       
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/tasks", async (req, res) => {
    try {
        const { title } = req.body;
        const newTask = await Task.create({ title });
        console.log("Task created successfully" + title + newTask);
        res.status(201).json(newTask);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        const task = await Task.findByPk(id);

        if (!task) return res.status(404).json({ error: "Task not found" });

        task.title = title !== undefined ? title : task.title;
        task.completed = completed !== undefined ? completed : task.completed;
        console.log("Task updated successfully" + id + title + completed);
        await task.save();
        

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);

        if (!task) return res.status(404).json({ error: "Task not found" });
        console.log("Task deleted successfully" + task);
        await task.destroy();

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
