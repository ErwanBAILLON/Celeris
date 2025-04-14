export default {
  ProjectIdParam: {
    name: "id",
    in: "path",
    description: "Identifiant du projet",
    required: true,
    schema: { type: "string" }
  },
  TaskIdParam: {
    name: "taskId",
    in: "path",
    description: "Identifiant de la tâche",
    required: true,
    schema: { type: "string" }
  }
};
