import React, { useState } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';

const { Option } = Select;

const TaskListForm = ({ addTask }) => {
  // State to control the visibility of the modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Form instance to manage the form fields
  const [form] = Form.useForm();

  // Function to show the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle modal cancellation
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to handle form submission
  const onFinish = (values) => {
    // Call the 'addTask' function passed as a prop with the form values
    addTask(values);

    // Close the modal and reset the form fields
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      {/* Button to open the modal */}
      <Button onClick={showModal} style={{ position: "relative", left: "100em", bottom: "2em" }}>Add Task</Button>

      {/* Modal for adding a new task */}
      <Modal title="Add Task" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} onFinish={onFinish}>
          {/* Form field for the task title */}
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

          {/* Form field for the task description */}
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

          {/* Form field for selecting the task list */}
          <Form.Item
            name="taskList"
            label="Assign to TaskList"
            rules={[
              {
                required: true,
                message: 'Please select a TaskList',
              },
            ]}
          >
            <Select style={{ width: 200 }}>
              <Option value="todo">Todo</Option>
              <Option value="inProgress">In Progress</Option>
              <Option value="done">Done</Option>
            </Select>
          </Form.Item>

          {/* Form buttons */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Task
            </Button>
            <Button style={{ marginLeft: 30 }} onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskListForm;
