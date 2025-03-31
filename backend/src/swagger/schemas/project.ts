export default {
    ProjectRequest: {
      type: "object",
      properties: {
        name: { type: "string", example: "Projet A" },
        description: { type: "string", example: "Description du projet" },
        startDate: { type: "string", format: "date-time", example: "2023-01-01T00:00:00Z" },
        endDate: { type: "string", format: "date-time", example: "2023-01-31T23:59:59Z" }
      },
      required: ["name"]
    },
    Project: {
      type: "object",
      properties: {
        id: { type: "string", example: "1" },
        name: { type: "string", example: "Projet A" },
        description: { type: "string", example: "Description du projet" },
        startDate: { type: "string", format: "date-time", example: "2023-01-01T00:00:00Z" },
        endDate: { type: "string", format: "date-time", example: "2023-01-31T23:59:59Z" }
      }
    },
    TaskRequest: {
      type: "object",
      properties: {
        name: { type: "string", example: "Tâche 1" },
        description: { type: "string", example: "Description de la tâche" },
        startDate: { type: "string", format: "date-time", example: "2023-01-05T09:00:00Z" },
        endDate: { type: "string", format: "date-time", example: "2023-01-05T17:00:00Z" },
        status: { type: "string", example: "in progress" },
        priority: { type: "string", example: "high" }
      },
      required: ["name"]
    },
    Task: {
      type: "object",
      properties: {
        id: { type: "string", example: "101" },
        name: { type: "string", example: "Tâche 1" },
        description: { type: "string", example: "Description de la tâche" },
        startDate: { type: "string", format: "date-time", example: "2023-01-05T09:00:00Z" },
        endDate: { type: "string", format: "date-time", example: "2023-01-05T17:00:00Z" },
        status: { type: "string", example: "in progress" },
        priority: { type: "string", example: "high" }
      }
    }
  };