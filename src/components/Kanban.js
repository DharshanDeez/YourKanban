import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, Space, Popover, Modal, Form, Input, Alert } from 'antd';
import { EditOutlined, DeleteOutlined, EllipsisOutlined, FileExcelOutlined } from '@ant-design/icons';
import './Kanban.css';
import TaskListForm from './TaskListForm';
import TaskDetail from './TaskDetail';
import * as XLSX from 'xlsx';

// Define a constant object that holds the type for the draggable items
const ItemTypes = {
    TASK: 'task',
};

// Task component - represents an individual task card
const Task = ({ id, title, description, onEdit, onDelete, onTaskDetail, onMoveTask }) => {
    // useDrag hook to enable dragging functionality for the task card
    const [, ref] = useDrag({
        type: ItemTypes.TASK,
        item: { id },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                onMoveTask(id, dropResult.listTitle); // Move task to the target list
            }
        },
    });

    // useState hook to manage the visibility of the Popover
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [popoverClicked, setPopoverClicked] = useState(false);

    // Handler to open the task edit modal
    const handleEditClick = (e) => {
        e.stopPropagation(); // Prevent the task card click from being triggered
        onEdit(id);
    };

    // Handler to open the task delete modal
    const handleDeleteClick = (e) => {
        e.stopPropagation(); // Prevent the task card click from being triggered
        onDelete(id);
    };

    // Handler to manage the visibility of the Popover
    const handlePopoverVisibleChange = (visible) => {
        setPopoverVisible(visible);
        setPopoverClicked(false); // Reset the state when popover visibility changes
    };

    // Handler to handle the click event on the task card
    const handleTaskClick = () => {
        // Show the task detail modal only if the popover is not visible and popover icon is not clicked
        if (!popoverVisible && !popoverClicked) {
            onTaskDetail(id);
        }
    };

    // Handler to handle the click event on the popover icon
    const handlePopoverClick = (e) => {
        e.stopPropagation(); // Prevent the task card click from being triggered
        setPopoverClicked(true); // Set the state when popover icon is clicked
    };

    // Render the task card component
    return (
        <div ref={ref} className="task" onClick={handleTaskClick}>
            <div className="task-header">
                <h3>{title}</h3>
                {/* Popover component from antd library to show edit and delete options */}
                <Popover
                    content={
                        <Space direction="vertical">
                            <Button type="link" onClick={handleEditClick}>
                                <EditOutlined /> Edit
                            </Button>
                            <Button type="link" danger onClick={handleDeleteClick}>
                                <DeleteOutlined /> Delete
                            </Button>
                        </Space>
                    }
                    trigger="click"
                    visible={popoverVisible}
                    onVisibleChange={handlePopoverVisibleChange}
                >
                    <Button icon={<EllipsisOutlined />} onClick={handlePopoverClick} />
                </Popover>
            </div>
            {/* Additional content for displaying task details in the modal */}
            <div>
                <p>{description}</p>
            </div>
        </div>
    );
};

// TaskList component - represents a list of tasks in the Kanban board
const TaskList = ({ title, tasks, moveTask, onEdit, onDelete, onTaskDetail }) => {
    // useDrop hook to enable dropping functionality for the task list
    const [, drop] = useDrop({
        accept: ItemTypes.TASK,
        drop: (item) => ({ listTitle: title }), // Task is dropped in this list
    });

    // Handler to move a task to a different list
    const handleMoveTask = (taskId, targetList) => {
        moveTask(taskId, targetList); // Call the moveTask function in the parent component (App)
    };

    // Render the task list component
    return (
        <div ref={drop} className="task-list">
            <h2>{title}</h2>
            {/* Render the tasks in this list */}
            {tasks.length === 0 ? (
                <p>No tasks available</p>
            ) : (
                tasks.map((task) => (
                    <Task
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onTaskDetail={onTaskDetail}
                        onMoveTask={handleMoveTask} // Pass the onMoveTask function to the Task component
                    />
                ))
            )}
        </div>
    );
};

// EditTaskModal component - a modal for editing a task
const EditTaskModal = ({ visible, task, onOk, onCancel }) => {
    // Form hook to manage the form state
    const [form] = Form.useForm();

    // Handler for the Ok button in the modal
    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const editedTask = { ...task, ...values };
                onOk(editedTask);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    // Render the EditTaskModal component
    return (
        <Modal title="Edit Task" visible={visible} onOk={handleOk} onCancel={onCancel}>
            <Form form={form} initialValues={task}>
                <Form.Item
                    name="title"
                    label="Task Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the Task title!',
                        },
                    ]}
                >
                    <Input placeholder="Enter Task Title" />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Task Description"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the Task Description!',
                        },
                    ]}
                >
                    <Input placeholder="Enter Task Description" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

// DeleteTaskModal component - a modal for deleting a task
const DeleteTaskModal = ({ visible, task, onOk, onCancel }) => {
    // Handler for the Ok button in the modal
    const handleOk = () => {
        onOk();
    };

    // Render the DeleteTaskModal component
    return (
        <Modal
            title="Delete Task"
            visible={visible}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Delete"
            okType="danger"
        >
            <p>Are you sure you want to delete this task?</p>
            <p>{task.title}</p>
        </Modal>
    );
};

// Kanban component - the main component for the Kanban Board application
function Kanban() {
    // useState hook to manage the state of the task lists
    const [taskLists, setTaskLists] = useState({
        todo: [],
        inProgress: [],
        done: [],
    });

    // useState hook to manage the state of the selected task and modals
    const [selectedTask, setSelectedTask] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [taskDetailVisible, setTaskDetailVisible] = useState(false);

    // Handler to move a task from one list to another
    const moveTask = (taskId, targetList) => {
        const sourceList = Object.keys(taskLists).find((key) =>
            taskLists[key].some((task) => task.id === taskId)
        );
        if (sourceList === targetList) return;

        const updatedTaskLists = { ...taskLists };
        const taskToMove = updatedTaskLists[sourceList].find((task) => task.id === taskId);
        updatedTaskLists[sourceList] = updatedTaskLists[sourceList].filter((task) => task.id !== taskId);
        updatedTaskLists[targetList] = [...updatedTaskLists[targetList], taskToMove];
        setTaskLists(updatedTaskLists);
    };

    // Handler to add a new task to a list
    const handleAddTask = (values) => {
        const { title, description, taskList } = values;
        const newTask = {
            id: Date.now(),
            title,
            description,
        };
        const updatedTaskLists = { ...taskLists };
        updatedTaskLists[taskList] = [...updatedTaskLists[taskList], newTask];
        setTaskLists(updatedTaskLists);
    };

    // Handler to open the edit modal for a task
    const handleEdit = (taskId) => {
        const taskToEdit = Object.values(taskLists).flat().find((task) => task.id === taskId);
        setSelectedTask(taskToEdit);
        setEditModalVisible(true);
    };

    // Handler to open the delete modal for a task
    const handleDelete = (taskId) => {
        setSelectedTask(taskId);
        setDeleteModalVisible(true);
    };

    // Handler for the Ok button in the edit modal
    const handleEditModalOk = (editedTask) => {
        const updatedTaskLists = { ...taskLists };
        for (const [key, value] of Object.entries(updatedTaskLists)) {
            const index = value.findIndex((task) => task.id === editedTask.id);
            if (index !== -1) {
                updatedTaskLists[key][index] = editedTask;
                break;
            }
        }
        setTaskLists(updatedTaskLists);
        setEditModalVisible(false);
        setSelectedTask(null);
    };

    // Handler for the Ok button in the delete modal
    const handleDeleteModalOk = () => {
        const updatedTaskLists = { ...taskLists };
        for (const [key, value] of Object.entries(updatedTaskLists)) {
            const index = value.findIndex((task) => task.id === selectedTask);
            if (index !== -1) {
                updatedTaskLists[key] = value.filter((task) => task.id !== selectedTask);
                break;
            }
        }
        setTaskLists(updatedTaskLists);
        setDeleteModalVisible(false);
        setSelectedTask(null);
    };

    // Handler for canceling any modal
    const handleModalCancel = () => {
        setSelectedTask(null);
        setEditModalVisible(false);
        setDeleteModalVisible(false);
        setTaskDetailVisible(false);
    };

    // Handler to open the task detail modal
    const handleTaskDetail = (taskId) => {
        const taskToShow = Object.values(taskLists).flat().find((task) => task.id === taskId);
        setSelectedTask(taskToShow);
        setTaskDetailVisible(true);
    };

    // Handler to export the entire task list to an Excel file
    const handleExportToExcel = () => {
        const dataToExport = {
            todo: taskLists.todo.map((task, index) => ({ ...task, id: index + 1 })),
            inProgress: taskLists.inProgress.map((task, index) => ({ ...task, id: index + 1 })),
            done: taskLists.done.map((task, index) => ({ ...task, id: index + 1 })),
        };

        // Check if there are no tasks to export
        const totalTasks = Object.values(dataToExport).reduce((total, tasks) => total + tasks.length, 0);
        if (totalTasks === 0) {
            // Show an Ant Design Alert component to the user that there are no tasks to export
            return (
                <Alert
                    message="No Tasks to Export"
                    description="There are no tasks to export."
                    type="info"
                    showIcon
                />
            );
        }

        const workbook = XLSX.utils.book_new();

        for (const [status, tasks] of Object.entries(dataToExport)) {
            if (tasks.length > 0) {
                const worksheet = XLSX.utils.json_to_sheet(tasks);
                XLSX.utils.book_append_sheet(workbook, worksheet, `${status} Tasks`);
            }
        }

        XLSX.writeFile(workbook, "kanban_board_tasks.xlsx"); // Use writeFile from 'xlsx' to export the workbook
    };

    // Render the main Kanaban component
    return (

        <div className="App">
            <h1>Kanban Board</h1>
            {/* Form component for adding a new task */}
            <div className="task-list-form">
                <TaskListForm addTask={handleAddTask} />
                {/* Add the Export to Excel button here */}
                <Button
                    type="primary"
                    icon={<FileExcelOutlined />}
                    onClick={handleExportToExcel}
                    style={{ position: 'absolute', right: "10em", top: "5em" }}
                >
                    Export to Excel
                </Button>
            </div>
            {/* DndProvider wraps the task lists to enable drag and drop */}
            <DndProvider backend={HTML5Backend}>
                <div className="kanban-board">
                    {/* Render each task list */}
                    {Object.keys(taskLists).map((listTitle) => (
                        <TaskList
                            key={listTitle}
                            title={listTitle}
                            tasks={taskLists[listTitle]}
                            moveTask={moveTask}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onTaskDetail={handleTaskDetail}
                        />
                    ))}
                </div>
            </DndProvider>
            {/* Modals for editing, deleting, and displaying task details */}
            {selectedTask && (
                <EditTaskModal
                    visible={editModalVisible}
                    task={selectedTask}
                    onOk={handleEditModalOk}
                    onCancel={handleModalCancel}
                />
            )}
            {selectedTask && (
                <DeleteTaskModal
                    visible={deleteModalVisible}
                    task={selectedTask}
                    onOk={handleDeleteModalOk}
                    onCancel={handleModalCancel}
                />
            )}
            {selectedTask && taskDetailVisible && (
                <TaskDetail
                    visible={taskDetailVisible}
                    task={selectedTask}
                    onCancel={() => setTaskDetailVisible(false)}
                />
            )}
        </div>
    )
}

// Export the Kanban component as the default export
export default Kanban;
