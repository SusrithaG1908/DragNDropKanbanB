# 🗂️ Drop & Drag Kanban Board App

A simple and intuitive **Kanban Board** built with **React**, **Node.js**, **Express**, and **MongoDB**. It allows users to create, edit, prioritize, and manage tasks across three columns: To Do, In Progress, and Done.

---
## ✨ Features

- 📝 Add, edit, and delete tasks.
- 🎯 Prioritize tasks as Low, Medium, or High.
- 📦 Organize tasks in 3 columns: To Do, In Progress, Done.
- 💡 Visual tags and color codes for clarity.
- 🌐 Responsive design that works on desktop and mobile.

---
## 📸 Screenshot

![Kanban Board](./assets/kanban-board.png)

---

## ⚙️ Tech Stack

| Frontend            | Backend             | Database |
|---------------------|---------------------|----------|
| React + Bootstrap   | Node.js + Express   | MongoDB  |

---


## 📁 Folder Structure

```text
kanban-board/
├── frontend/              # React frontend
│   ├── public/
│   ├── src/
│   │   └── App.jsx
├── backend/              # Express backend
│   └── server.js
├── assets/              # Screenshots or logos
│   └── kanban-board.png
├── README.md
└── package.json
```

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js & npm
- MongoDB installed and running locally

---

### 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm start
```
---
Backend Setup
```bash
cd backend
npm install
node server.js
The backend runs on http://localhost:5000 by default.
```
---

🔌 API Endpoints
---
| Method | Endpoint     | Description    |
| ------ | ------------ | -------------- |
| GET    | `/tasks`     | Get all tasks  |
| POST   | `/tasks`     | Add a new task |
| PUT    | `/tasks/:id` | Update a task  |
| DELETE | `/tasks/:id` | Delete a task  |

---

## 📚 Usage Guide

Once the frontend and backend servers are running:

### 🔗 1. Access the App

Open your browser and navigate to: http://localhost:3000

### 🗂️ 2. Understand the Columns

The Kanban board displays tasks in **three columns**:

- 📋 **To Do** — Planned tasks
- 🚧 **In Progress** — Currently being worked on
- ✅ **Done** — Completed tasks

### ➕ 3. Add a New Task

1. Click the **`+ Add Task`** button.
2. Fill in the following:
   - **Title**: Task name
   - **Description**: Additional info (optional)
   - **Status**: To Do / In Progress / Done
   - **Priority**: Low / Medium / High
3. Click **`Add Task`** to save.

### ✏️ 4. Edit a Task

- Click the **edit icon** (✏️) on a task card.
- Modify the fields.
- Click **`Save Changes`** to update.

### 🗑️ 5. Delete a Task

- Click the **delete icon** (🗑️) on a task.
- Confirm the deletion when prompted.

### 🎯 6. Task Priorities

Each task is tagged with a **priority level**:

| Level   | Badge             |
|---------|-------------------|
| 🟢 Low  | Green label       |
| 🟡 Medium | Yellow label    |
| 🔴 High | Red label         |

### 📦 7. Task Status Summary

| Column        | Meaning                     |
|---------------|-----------------------------|
| 📋 To Do       | Tasks yet to be started     |
| 🚧 In Progress | Tasks currently being worked on |
| ✅ Done        | Finished and completed tasks  |

---

> 📝 Tip: You can edit or delete any task directly from the card, and prioritize your work visually with the help of color-coded badges.




🤝 Contributing
Pull requests are welcome! For significant changes, open an issue to discuss what you'd like to do.

---

## 📬 Contact

Have questions, feedback, or ideas for improvement?

Feel free to reach out!

- 📧 Email: [gudimetlasusritha@gmail.com](mailto:gudimetlasusritha@gmail.com)



