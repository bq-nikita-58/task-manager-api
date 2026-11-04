
const express = require("express");

function createApp() {
  const app = express();

  // Middleware to parse JSON request bodies.
  app.use(express.json());

  // In-memory storage for practice.
  // Data will reset when the application restarts.
  let tasks = [];
  let nextId = 1;

  // Health-check endpoint.
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      service: "task-manager-api",
    });
  });

  // Get all tasks.
  app.get("/api/tasks", (req, res) => {
    res.status(200).json({
      success: true,
      data: tasks,
    });
  });

  // Get a task by ID.
  app.get("/api/tasks/:id", (req, res) => {
    const task = tasks.find(
      (item) => item.id === Number(req.params.id)
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  });

  // Create a task.
  app.post("/api/tasks", (req, res) => {
    const { title } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid title is required",
      });
    }

    const task = {
      id: nextId++,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    tasks.push(task);

    res.status(201).json({
      success: true,
      data: task,
    });
  });

  // Update a task.
  app.put("/api/tasks/:id", (req, res) => {
    const task = tasks.find(
      (item) => item.id === Number(req.params.id)
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const { title, completed } = req.body;

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title must be a non-empty string",
        });
      }

      task.title = title.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "Completed must be a boolean",
        });
      }

      task.completed = completed;
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  });

  // Delete a task.
  app.delete("/api/tasks/:id", (req, res) => {
    const taskIndex = tasks.findIndex(
      (item) => item.id === Number(req.params.id)
    );

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    tasks.splice(taskIndex, 1);

    res.status(200).json({
        status: "broken",
        service: "task-manager-api",
    });
  });

  return app;
}

module.exports = createApp;
