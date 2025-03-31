export default {
  "/projects": {
    get: {
      summary: "Obtenir tous les projets",
      tags: ["Projects"],
      description: "Obtient tous les projets de l'utilisateur authentifié.",
      responses: {
        "200": {
          description: "Liste des projets",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Project" }
              }
            }
          }
        },
        "500": { description: "Erreur interne du serveur" }
      }
    },
    post: {
      summary: "Créer un nouveau projet",
      tags: ["Projects"],
      description: "Crée un nouveau projet pour l'utilisateur.",
      requestBody: {
        description: "Données du projet à créer",
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ProjectRequest" }
          }
        }
      },
      responses: {
        "201": { description: "Projet créé avec succès" },
        "400": { description: "Requête invalide" },
        "500": { description: "Erreur interne du serveur" }
      }
    }
  },
  "/projects/{id}": {
    get: {
      summary: "Obtenir un projet par ID",
      tags: ["Projects"],
      description: "Obtient un projet spécifique par son identifiant.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: {
        "200": {
          description: "Détails du projet",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Project" }
            }
          }
        },
        "404": { description: "Projet non trouvé" },
        "500": { description: "Erreur interne du serveur" }
      }
    },
    put: {
      summary: "Mettre à jour un projet",
      tags: ["Projects"],
      description: "Met à jour un projet existant.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        description: "Données du projet à mettre à jour",
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ProjectRequest" }
          }
        }
      },
      responses: {
        "200": { description: "Projet mis à jour avec succès" },
        "404": { description: "Projet non trouvé" },
        "500": { description: "Erreur interne du serveur" }
      }
    },
    delete: {
      summary: "Supprimer un projet",
      tags: ["Projects"],
      description: "Supprime un projet existant.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: {
        "200": { description: "Projet supprimé avec succès" },
        "404": { description: "Projet non trouvé" },
        "500": { description: "Erreur interne du serveur" }
      }
    }
  },
  "/projects/{id}/tasks": {
    get: {
      summary: "Obtenir les tâches d'un projet",
      tags: ["Projects"],
      description: "Obtient toutes les tâches associées à un projet.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: {
        "200": {
          description: "Liste des tâches",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Task" }
              }
            }
          }
        },
        "404": { description: "Projet non trouvé" },
        "500": { description: "Erreur interne du serveur" }
      }
    },
    post: {
      summary: "Créer une tâche pour un projet",
      tags: ["Projects"],
      description: "Crée une nouvelle tâche dans un projet donné.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        description: "Données de la tâche",
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/TaskRequest" }
          }
        }
      },
      responses: {
        "201": { description: "Tâche créée avec succès" },
        "400": { description: "Requête invalide" },
        "404": { description: "Projet non trouvé" },
        "500": { description: "Erreur interne du serveur" }
      }
    }
  },
  "/projects/{id}/tasks/{taskId}": {
    get: {
      summary: "Obtenir une tâche par ID",
      tags: ["Projects"],
      description: "Obtient les détails d'une tâche spécifique d'un projet.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
        { name: "taskId", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: {
        "200": {
          description: "Détails de la tâche",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Task" }
            }
          }
        },
        "404": { description: "Projet ou tâche non trouvé" },
        "500": { description: "Erreur interne du serveur" }
      }
    },
    put: {
      summary: "Mettre à jour une tâche",
      tags: ["Projects"],
      description: "Met à jour une tâche existante dans un projet.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
        { name: "taskId", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        description: "Données de la tâche à mettre à jour",
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/TaskRequest" }
          }
        }
      },
      responses: {
        "200": { description: "Tâche mise à jour avec succès" },
        "404": { description: "Projet ou tâche non trouvé" },
        "500": { description: "Erreur interne du serveur" }
      }
    },
    delete: {
      summary: "Supprimer une tâche",
      tags: ["Projects"],
      description: "Supprime une tâche d'un projet.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
        { name: "taskId", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: {
        "200": { description: "Tâche supprimée avec succès" },
        "404": { description: "Projet ou tâche non trouvé" },
        "500": { description: "Erreur interne du serveur" }
      }
    }
  }
};
