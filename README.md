# celeris.studio

## Idea

- Create a project organizer / task manager that can be used to manage tasks and projects.

The app should include the following features:
- Projects and task creation.
- A calendar view to see all tasks and projects.
- A kanban board to manage projects (Github Projects).
- A timeline view to see all tasks and projects.
- A dashboard to see all tasks and projects.

## Features

- Create projects
- Create tasks
- Calendar view
- Kanban board
- Timeline view
- Dashboard
- Offline access (PWA)
- Notifications

## Tech Stack

### Frontend

- React
    - Big Calendar
    - Kanban

### Backend

- Node.js (TypeScript)
    - Express
    - TypeORM
    - JWT
    - Bcrypt

### Database

- PostgreSQL

The database will probably be expanded with modules to support additional features (reminders, file attachments, etc.).

### Deployment

- Docker
- Kubernetes (?)
- Full CI/CD pipeline (Github Actions)

## User Stories

#### Basic Features

As a user, I want to be able to :

- create an account so that I can manage my tasks and projects. I also want to be able to log in and log out of my account.
- create projects so that I can manage the tasks associated with it. I also want to be able to edit and delete projects.
- create tasks so that I can manage my work. I also want to be able to edit and delete tasks.
- see all my tasks and projects in a calendar view so that I can manage my time effectively.
- see my tasks in a kanban board so that I can manage my work effectively.
- see my tasks and projects in a timeline view so that I can manage my time effectively.

#### Notifications

As a user, I want to receive notifications about:

- unfinished tasks
- upcoming deadlines
- reminders that I set

#### Offline Access

As a user, I want to :

- download the app so that I can use it offline (PWA).
- have a local storage so that I can save my tasks and projects offline.
- sync my tasks and projects with the server when I am online.
- receive updates to the application when I am online.

## API Routes

Base url: `https://api.celeris.studio`

### Auth

- `POST /auth/register` - Register a new user
    - Request body:
        ```json
        {
            "name": "John Doe",
            "email": "x@x.com",
            "password": "password"
        }
        ```
    - Response:
        ```json
        {
            "name": "John Doe",
            "accessToken": "token",
            "refreshToken": "token"
        }

- `POST /auth/login` - Login a user

    - Request body:
        ```json
        {
            "email": "x@x.com",
            "password": "password"
        }
        ```
    - Response:
        ```json
        {
            "name": "John Doe",
            "accessToken": "token",
            "refreshToken": "token"
        }
        ```

- `GET /auth/logout` - Logout a user (invalidate token)
    - Response:
        ```json
        {
            "message": "Logged out"
        }
        ```

- `GET /auth/refresh` - Refresh a user token

    - Response:
        ```json
        {
            "accessToken": "token",
            "refreshToken": "token"
        }
        ```

### Projects

> All routes need JWT authentication. The token will be used to retrieve the user id.

- `GET /projects` - Get all projects.

    - Response:
        ```json
        [
            {
                "id": "1",
                "name": "Project 1",
                "description": "Description 1",
                "startDate": "2023-01-01",
                "endDate": "2023-01-31"
            },
            {
                "id": "2",
                "name": "Project 2",
                "description": "Description 2",
                "startDate": "2023-02-01",
                "endDate": "2023-02-28"
            }
        ]
        ```

- `GET /projects/:id` - Get a project by id.

    - Response:
        ```json
        {
            "id": "1",
            "name": "Project 1",
            "description": "Description 1",
            "startDate": "2023-01-01",
            "endDate": "2023-01-31"
        }
        ```

- `POST /projects` - Create a new project.

    - Request body:
        ```json
        {
            "name": "Project 1",
            "description": "Description 1",
            "startDate": "2023-01-01",
            "endDate": "2023-01-31"
        }
        ```
    - Response:
        ```json
        {
            "message": "Project created",
        }
        ```

- `PUT /projects/:id` - Update a project by id.

    - Request body:
        ```json
        {
            "id": "1",
            "name": "Project 1",
            "description": "Description 1",
            "startDate": "2023-01-01",
            "endDate": "2023-01-31"
        }
        ```
    - Response:
        ```json
        {
            "message": "Project updated",
        }
        ```

- `DELETE /projects/:id` - Delete a project by id.

    - Response:
        ```json
        {
            "message": "Project deleted",
        }
        ```

### Tasks

> All routes need JWT authentication. The token will be used to retrieve the user id.

- `POST /projects/:id/tasks` - Create a new task for a project.

    - Request body:
        ```json
        {
            "name": "Task 1",
            "description": "Description 1",
            "startDate": "2023-01-01",
            "endDate": "2023-01-31",
            "status": "in progress",
            "priority": "high",
            "tags": ["tag1", "tag2"]
        }
        ```
    - Response:
        ```json
        {
            "message": "Task created",
        }
        ```

- `GET /projects/:id/tasks` - Get all tasks for a project.

    - Response:
        ```json
        [
            {
                "id": "1",
                "name": "Task 1",
                "description": "Description 1",
                "startDate": "2023-01-01",
                "endDate": "2023-01-31",
                "status": "in progress",
                "priority": "high",
                "tags": ["tag1", "tag2"]
            },
            {
                "id": "2",
                "name": "Task 2",
                "description": "Description 2",
                "startDate": "2023-02-01",
                "endDate": "2023-02-28",
                "status": "completed",
                "priority": "low",
                "tags": []
            }
        ]
        ```

- `GET /projects/:id/tasks/:taskId` - Get a task by id.

    - Response:
        ```json
        {
            "id": "1",
            "name": "Task 1",
            "description": "Description 1",
            "startDate": "2023-01-01",
            "endDate": "2023-01-31",
            "status": "in progress",
            "priority": "high",
            "tags": ["tag1", "tag2"]
        }
        ```

- `PUT /projects/:id/tasks/:taskId` - Update a task by id.

    - Request body:
        ```json
        {
            "id": "1",
            "name": "Task 1",
            "description": "Description 1",
            "startDate": "2023-01-01",
            "endDate": "2023-01-31",
            "status": "in progress",
            "priority": "high",
            "tags": ["tag1", "tag2"]
        }
        ```
    - Response:
        ```json
        {
            "message": "Task updated",
        }
        ```

- `DELETE /projects/:id/tasks/:taskId` - Delete a task by id.

    - Response:
        ```json
        {
            "message": "Task deleted",
        }
        ```

### Reminders

> All routes need JWT authentication. The token will be used to retrieve the user id.

- `GET /reminders` - Get all reminders

    - Response:
        ```json
        [
            {
                "id": "1",
                "name": "Reminder 1",
                "description": "Description 1",
                "dateTime": 1672531199000,
                "status": "active"
            },
            {
                "id": "2",
                "name": "Reminder 2",
                "description": "Description 2",
                "dateTime": 1672531199000,
                "status": "inactive"
            }
        ]
        ```

- `POST /reminders` - Create a new reminder

    - Request body:
        ```json
        {
            "name": "Reminder 1",
            "description": "Description 1",
            "dateTime": 1672531199000,
            "status": "active"
        }
        ```
    - Response:
        ```json
        {
            "message": "Reminder created",
        }
        ```

- `GET /reminders/:id` - Get a reminder by id

    - Response:
        ```json
        {
            "id": "1",
            "name": "Reminder 1",
            "description": "Description 1",
            "dateTime": 1672531199000,
            "status": "active"
        }
        ```

- `PUT /reminders/:id` - Update a reminder by id

    - Request body:
        ```json
        {
            "id": "1",
            "name": "Reminder 1",
            "description": "Description 1",
            "dateTime": 1672531199000,
            "status": "active"
        }
        ```
    - Response:
        ```json
        {
            "message": "Reminder updated",
        }
        ```

- `DELETE /reminders/:id` - Delete a reminder by id

    - Response:
        ```json
        {
            "message": "Reminder deleted",
        }
        ```

### Tags
> All routes need JWT authentication. The token will be used to retrieve the user id.

- `GET /tags` - Get all tags

    - Response:
        ```json
        [
            {
                "id": "1",
                "name": "Tag 1",
                "color": "#FF0000",
                "description": "Description 1"
            },
            {
                "id": "2",
                "name": "Tag 2",
                "color": "#00FF00",
                "description": "Description 2"
            }
        ]
        ```

- `POST /tags` - Create a new tag
    - Request body:
        ```json
        {
            "name": "Tag 1",
            "color": "#FF0000",
            "description": "Description 1"
        }
        ```
    - Response:
        ```json
        {
            "message": "Tag created",
        }
        ```

## Entities

### User
- id
- name
- email
- passwordHash
- createdAt

### Project
- id (randomly generated UUID)
- ownerId (reference to User)
- name
- description
- startDate
- endDate

### Task
- id
- projectId (reference to Project)
- name
- description
- startDate
- endDate
- status
- priority
- tags

### Reminder
- id
- ownerId (reference to User)
- taskId (reference to Task - optional)
- projectId (reference to Project - optional)
- name
- description
- dateTime (unix timestamp)
- status

### Tag
- id
- ownerId (reference to User)
- name
- color (hex color code)
- description

## Database Schema

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    ownerId INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    startDate TIMESTAMP,
    endDate TIMESTAMP
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    projectId INTEGER REFERENCES projects(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    startDate TIMESTAMP,
    endDate TIMESTAMP,
    status VARCHAR(255),
    priority VARCHAR(255),
    tags TEXT[]
);

CREATE TABLE reminders (
    id SERIAL PRIMARY KEY,
    ownerId INTEGER REFERENCES users(id),
    taskId INTEGER REFERENCES tasks(id),
    projectId INTEGER REFERENCES projects(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dateTime TIMESTAMP,
    status VARCHAR(255)
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    ownerId INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) NOT NULL,
    description TEXT
);
```

## Notification Service

- Use Firebase Cloud Messaging (FCM) to send notifications to the user.
- Use a cron job to check for reminders and send notifications.
- Use a queue (e.g. Bull) to handle notifications.
- Use a service worker to handle notifications in the frontend.

## Future Improvements

- Multiple users in a project
- Knowledge management system (i.e. Obsidian)
- File attachments
- Chat feature
- Calendar integration (Google Calendar, Outlook, etc.)
