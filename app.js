const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory task storage (replace with a database in production)
let tasks = [];

// Helper function to get today's tasks
function getToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

// API Endpoints

// Add a task
app.post('/tasks', (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ error: 'Task is required' });
    }
    tasks.push({
        id: Date.now(),
        task,
        completed: false,
        date: getToday().toISOString().split('T')[0]
    });
    res.status(201).json({ message: 'Task added successfully', task });
});

// Mark a task as done
app.put('/tasks/:id/done', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    tasks[taskIndex].completed = true;
    res.json({ message: 'Task marked as done', task: tasks[taskIndex] });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== taskId);
    res.json({ message: 'Task deleted successfully' });
});

// View today's tasks
app.get('/tasks', (req, res) => {
    const today = getToday().toISOString().split('T')[0];
    const todaysTasks = tasks.filter(task => task.date === today);
    res.json(todaysTasks);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Daily To-Do App is running on http://localhost:${PORT}`);
});