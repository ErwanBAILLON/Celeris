export default {
    ReminderRequest: {
      type: "object",
      properties: {
        name: { type: "string", example: "Alerte 1" },
        description: { type: "string", example: "Description de l'alerte" },
        dateTime: { type: "string", format: "date-time", example: "2023-01-10T09:00:00Z" },
        status: { type: "string", example: "active" }
      },
      required: ["name", "dateTime", "status"]
    },
    Reminder: {
      type: "object",
      properties: {
        id: { type: "string", example: "1" },
        name: { type: "string", example: "Alerte 1" },
        description: { type: "string", example: "Description de l'alerte" },
        dateTime: { type: "string", format: "date-time", example: "2023-01-10T09:00:00Z" },
        status: { type: "string", example: "active" }
      }
    }
  };