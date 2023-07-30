import React from 'react';
import { Modal, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const TaskDetail = ({ visible, task, onCancel }) => {
    // The TaskDetail component displays the details of a task in a modal.

    return (
        <Modal
            title="Task Details"
            visible={visible}
            onCancel={onCancel}
            footer={null} // Hiding the footer to remove the default "Cancel" button
        >
            {/* Displaying the title of the task with a heading level of 4 */}
            <Title level={4}>{task.title}</Title>

            {/* Displaying the description of the task */}
            <Paragraph>{task.description}</Paragraph>
        </Modal>
    );
};

export default TaskDetail;
