
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Badge,
  Toast,
  ToastContainer,
  Spinner
} from "react-bootstrap";
import {
  PencilSquare,
  Trash,
  Plus,
  CheckCircle,
  ArrowRightCircle,
  ListTask,
  FlagFill,
  GripVertical
} from "react-bootstrap-icons";

const columns = {
  todo: {
    title: "To Do",
    bg: "light",
    icon: <ListTask className="me-2" />,
    textClass: "text-dark",
  },
  inprogress: {
    title: "In Progress",
    bg: "warning",
    icon: <ArrowRightCircle className="me-2" />,
    textClass: "text-dark",
  },
  done: {
    title: "Done",
    bg: "success",
    icon: <CheckCircle className="me-2" />,
    textClass: "text-white",
  },
};

const priorities = {
  low: {
    text: "Low",
    variant: "success",
    icon: <FlagFill className="text-success" />,
  },
  medium: {
    text: "Medium",
    variant: "warning",
    icon: <FlagFill className="text-warning" />,
  },
  high: {
    text: "High",
    variant: "danger",
    icon: <FlagFill className="text-danger" />,
  },
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentTask, setCurrentTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskColumn, setNewTaskColumn] = useState("todo");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const apiUrl = process.env.REACT_APP_BACKEND_API_URL;
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${apiUrl}/tasks`);
      setTasks(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      showToastMessage("Failed to fetch tasks");
      setIsLoading(false);
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const resetForm = () => {
    setNewTaskTitle("");
    setNewTaskDesc("");
    setNewTaskColumn("todo");
    setNewTaskPriority("medium");
    setCurrentTask(null);
  };

  const openEditModal = (task) => {
    setModalMode("edit");
    setCurrentTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDesc(task.description);
    setNewTaskColumn(task.status);
    setNewTaskPriority(task.priority || "medium");
    setShowModal(true);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      showToastMessage("Title cannot be empty");
      return;
    }
    try {
      const res = await axios.post(`${apiUrl}tasks`, {
        title: newTaskTitle,
        description: newTaskDesc,
        status: newTaskColumn,
        priority: newTaskPriority,
      });
      setTasks([...tasks, res.data]);
      setShowModal(false);
      resetForm();
      showToastMessage("Task added successfully");
    } catch (error) {
      console.error(error);
      showToastMessage("Failed to add task");
    }
  };

  const handleEditTask = async () => {
    if (!currentTask) return;
    try {
      const updated = {
        title: newTaskTitle,
        description: newTaskDesc,
        status: newTaskColumn,
        priority: newTaskPriority,
      };
      await axios.put(`${apiUrl}/tasks/${currentTask._id}`, updated);
      setTasks(tasks.map((t) => (t._id === currentTask._id ? { ...t, ...updated } : t)));
      setShowModal(false);
      resetForm();
      showToastMessage("Task updated successfully");
    } catch (error) {
      console.error(error);
      showToastMessage("Failed to update task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${apiUrl}/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
      showToastMessage("Task deleted successfully");
    } catch (error) {
      console.error(error);
      showToastMessage("Failed to delete task");
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    
    // Validate droppable IDs
    if (!columns[destination.droppableId] || !columns[source.droppableId]) {
      console.error("Invalid droppable ID encountered");
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const task = tasks.find((t) => t._id === draggableId);
    if (!task) return;

    const newTasks = [...tasks];
    const sourceTasks = newTasks
      .filter((t) => t.status === source.droppableId)
      .sort((a, b) => a.order - b.order);
    const destTasks = newTasks
      .filter((t) => t.status === destination.droppableId)
      .sort((a, b) => a.order - b.order);

    const [movedTask] = sourceTasks.splice(source.index, 1);
    if (source.droppableId !== destination.droppableId) {
      movedTask.status = destination.droppableId;
    }
    destTasks.splice(destination.index, 0, movedTask);

    const updatedTasks = newTasks.map((t) => {
      if (t._id === movedTask._id) {
        return { ...t, status: movedTask.status, order: destination.index };
      }
      const sourceIndex = sourceTasks.findIndex((st) => st._id === t._id);
      if (sourceIndex !== -1) return { ...t, order: sourceIndex };
      const destIndex = destTasks.findIndex((dt) => dt._id === t._id);
      if (destIndex !== -1) return { ...t, order: destIndex };
      return t;
    });

    setTasks(updatedTasks);

    try {
      await axios.put(`${apiUrl}/tasks/${movedTask._id}`, {
        status: movedTask.status,
        order: destination.index,
      });

      await Promise.all([
        ...sourceTasks.map((task, index) =>
          axios.put(`${apiUrl}/tasks/${task._id}`, { order: index })
        ),
        ...destTasks.map((task, index) =>
          axios.put(`${apiUrl}/tasks/${task._id}`, { order: index })
        ),
      ]);
    } catch (error) {
      console.error(error);
      showToastMessage("Failed to update task position");
      fetchTasks();
    }
  };

  const tasksByColumn = (columnId) =>
    tasks
      .filter((task) => task?.status === columnId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="mt-3 px-4">
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg="info">
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <h2 className="text-center mb-4">Kanban Task Board</h2>
      <Button 
        variant="primary" 
        onClick={() => { 
          setModalMode("add"); 
          setShowModal(true); 
          resetForm(); 
        }}
      >
        <Plus /> Add Task
      </Button>

      <DragDropContext onDragEnd={onDragEnd}>
        <Row className="mt-4">
          {Object.entries(columns).map(([columnId, columnInfo]) => (
            <Col key={columnId} md={4}>
              <Card bg={columnInfo.bg} text={columnInfo.textClass} className="mb-4">
                <Card.Header>
                  {columnInfo.icon}
                  {columnInfo.title}
                  <Badge pill bg="secondary" className="ms-2">
                    {tasksByColumn(columnId).length}
                  </Badge>
                </Card.Header>
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <Card.Body
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        minHeight: "200px",
                        backgroundColor: snapshot.isDraggingOver ? '#f8f9fa' : '',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      {tasksByColumn(columnId).map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              className="mb-2"
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.8 : 1,
                                transform: snapshot.isDragging ? 'rotate(2deg)' : '',
                                boxShadow: snapshot.isDragging ? '0 4px 8px rgba(0,0,0,0.2)' : '',
                              }}
                            >
                              <Card.Body>
                                <div {...provided.dragHandleProps} style={{ cursor: 'grab' }}>
                                  <GripVertical size={20} className="float-end" />
                                </div>
                                <Card.Title>{task.title}</Card.Title>
                                <Card.Text>{task.description}</Card.Text>
                                <Badge bg={priorities[task.priority]?.variant || "secondary"}>
                                  {priorities[task.priority]?.icon}
                                  {priorities[task.priority]?.text}
                                </Badge>
                                <div className="mt-2 text-end">
                                  <Button 
                                    size="sm" 
                                    variant="outline-secondary" 
                                    onClick={() => openEditModal(task)} 
                                    className="me-2"
                                  >
                                    <PencilSquare />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline-danger" 
                                    onClick={() => handleDeleteTask(task._id)}
                                  >
                                    <Trash />
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Card.Body>
                  )}
                </Droppable>
              </Card>
            </Col>
          ))}
        </Row>
      </DragDropContext>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === "add" ? "Add Task" : "Edit Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Enter task description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select 
                value={newTaskColumn} 
                onChange={(e) => setNewTaskColumn(e.target.value)}
              >
                {Object.keys(columns).map((col) => (
                  <option key={col} value={col}>
                    {columns[col].title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select 
                value={newTaskPriority} 
                onChange={(e) => setNewTaskPriority(e.target.value)}
              >
                {Object.keys(priorities).map((p) => (
                  <option key={p} value={p}>
                    {priorities[p].text}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={modalMode === "add" ? handleAddTask : handleEditTask}
          >
            {modalMode === "add" ? "Add Task" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;