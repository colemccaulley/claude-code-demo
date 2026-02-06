#!/usr/bin/env node
/**
 * Simple Task Manager CLI
 *
 * Demonstrates JavaScript/Node.js capabilities including:
 * - Command-line argument parsing
 * - File system operations
 * - JSON data management
 * - Interactive CLI features
 */

const fs = require('fs');
const path = require('path');

class TaskManager {
    constructor(filepath = './tasks.json') {
        this.filepath = filepath;
        this.tasks = this.loadTasks();
    }

    loadTasks() {
        try {
            if (fs.existsSync(this.filepath)) {
                const data = fs.readFileSync(this.filepath, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading tasks:', error.message);
        }
        return [];
    }

    saveTasks() {
        try {
            fs.writeFileSync(this.filepath, JSON.stringify(this.tasks, null, 2));
            return true;
        } catch (error) {
            console.error('Error saving tasks:', error.message);
            return false;
        }
    }

    addTask(description, priority = 'medium') {
        const task = {
            id: Date.now(),
            description,
            priority,
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.tasks.push(task);
        this.saveTasks();
        console.log(`✓ Task added: ${description}`);
        return task;
    }

    listTasks(filter = 'all') {
        let filteredTasks = this.tasks;

        if (filter === 'completed') {
            filteredTasks = this.tasks.filter(t => t.completed);
        } else if (filter === 'pending') {
            filteredTasks = this.tasks.filter(t => !t.completed);
        }

        if (filteredTasks.length === 0) {
            console.log('No tasks found.');
            return;
        }

        console.log('\n=== Task List ===\n');
        filteredTasks.forEach((task, index) => {
            const status = task.completed ? '✓' : '○';
            const priority = task.priority.toUpperCase();
            console.log(`${status} [${priority}] ${task.description}`);
            console.log(`  ID: ${task.id} | Created: ${new Date(task.createdAt).toLocaleDateString()}\n`);
        });
    }

    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
            task.completedAt = new Date().toISOString();
            this.saveTasks();
            console.log(`✓ Task completed: ${task.description}`);
            return true;
        }
        console.log('Task not found.');
        return false;
    }

    deleteTask(taskId) {
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            const task = this.tasks.splice(index, 1)[0];
            this.saveTasks();
            console.log(`✓ Task deleted: ${task.description}`);
            return true;
        }
        console.log('Task not found.');
        return false;
    }

    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;

        console.log('\n=== Task Statistics ===');
        console.log(`Total Tasks: ${total}`);
        console.log(`Completed: ${completed}`);
        console.log(`Pending: ${pending}`);
        console.log(`Completion Rate: ${total > 0 ? ((completed / total) * 100).toFixed(1) : 0}%\n`);
    }
}

// CLI Interface
function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const manager = new TaskManager();

    switch (command) {
        case 'add':
            const description = args.slice(1).join(' ');
            if (description) {
                manager.addTask(description);
            } else {
                console.log('Please provide a task description.');
            }
            break;

        case 'list':
            const filter = args[1] || 'all';
            manager.listTasks(filter);
            break;

        case 'complete':
            const completeId = parseInt(args[1]);
            if (completeId) {
                manager.completeTask(completeId);
            } else {
                console.log('Please provide a task ID.');
            }
            break;

        case 'delete':
            const deleteId = parseInt(args[1]);
            if (deleteId) {
                manager.deleteTask(deleteId);
            } else {
                console.log('Please provide a task ID.');
            }
            break;

        case 'stats':
            manager.getStats();
            break;

        default:
            console.log(`
Task Manager CLI - Demo by Claude Code

Usage:
  node task-manager.js <command> [arguments]

Commands:
  add <description>     Add a new task
  list [filter]        List tasks (all/completed/pending)
  complete <id>        Mark a task as completed
  delete <id>          Delete a task
  stats                Show task statistics

Examples:
  node task-manager.js add "Review pull requests"
  node task-manager.js list pending
  node task-manager.js complete 1234567890
  node task-manager.js stats
            `);
    }
}

if (require.main === module) {
    main();
}

module.exports = TaskManager;
