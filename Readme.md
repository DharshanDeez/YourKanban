# Your Kanban

This application is a front-end React app built using Ant Design and React DnD (Drag and Drop). It allows users to manage tasks using the Kanban board methodology. The app supports the following functionalities:

- **Add Task**: Users can add tasks to the board by selecting the task list to which the task belongs. They need to provide the title and description of the task.

- **Edit Task**: Users can edit the details of a task by clicking on the "Edit" button. A modal will appear, allowing them to modify the task's title and description.

- **Delete Task**: Users can delete a task by clicking on the "Delete" button. A confirmation modal will appear to ensure they want to proceed with the deletion.

- **Move Task**: Users can move a task to a different task list by dragging and dropping it. To move a task, they need to hover over the task, press the left mouse button, and then drag the task to the desired task list. Once the task is dropped, it will be moved to the new list.

- **Export Entire Task List**: Users can export the entire task list to an Excel file by clicking on the "Export to Excel" button. When clicked, the application will gather the tasks from each task list (i.e., Todo, In Progress, Done), and if there are tasks available, it will generate an Excel file containing the task details. Each task list will be represented as a separate sheet in the Excel file.

If there are no tasks available in any of the task lists, a friendly message will be shown to the user using Ant Design's Alert component, indicating that there are no tasks to export.

The exported Excel file will be named "kanban_board_tasks.xlsx" and will be saved to the user's device. Users can then open the Excel file to view and manage the task details outside of the Kanban application.

This feature provides users with the flexibility to analyze and organize their tasks using their preferred spreadsheet software, making it easier to share or collaborate on tasks with other team members.



The code contains detailed explanations and comments to help understand the logic behind each functionality and component.

Feel free to reach out if you have any enhancement suggestions or ideas to improve this application or for any other daily-life related needs. I'm here to assist you!

