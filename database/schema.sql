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
    priority VARCHAR(255)
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

CREATE TABLE tasks_tags (
    taskId INTEGER REFERENCES tasks(id),
    tagId INTEGER REFERENCES tags(id),
    PRIMARY KEY (taskId, tagId)
);
