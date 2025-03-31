export default {
  "/reminders": {
    get: {
      summary: "Obtenir toutes les alertes",
      tag: ["Reminders"],
      description: "Retourne toutes les alertes associées à l'utilisateur authentifié.",
      responses: {
        "200": {
          description: "Liste des alertes",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Reminder" }
              }
            }
          }
        },
        "500": { description: "Erreur interne du serveur" }
      }
    },
    post: {
      summary: "Créer une nouvelle alerte",
      description: "Crée une nouvelle alerte pour l'utilisateur.",
      requestBody: {
        description: "Données de l'alerte à créer",
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ReminderRequest" }
          }
        }
      },
      responses: {
        "201": { description: "Alerte créée avec succès" },
        "400": { description: "Requête invalide" },
        "500": { description: "Erreur interne du serveur" }
      }
    }
  },
  "/reminders/{id}": {
    get: {
      summary: "Obtenir une alerte par ID",
      tag: ["Reminders"],
      description: "Retourne les détails d'une alerte spécifique.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: {
        "200": {
          description: "Détails de l'alerte",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Reminder" }
            }
          }
        },
        "404": { description: "Alerte non trouvée" },
        "500": { description: "Erreur interne du serveur" }
      }
    },
    put: {
      summary: "Mettre à jour une alerte",
      tag: ["Reminders"],
      description: "Met à jour une alerte existante.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        description: "Données de l'alerte à mettre à jour",
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ReminderRequest" }
          }
        }
      },
      responses: {
        "200": { description: "Alerte mise à jour avec succès" },
        "404": { description: "Alerte non trouvée" },
        "500": { description: "Erreur interne du serveur" }
      }
    },
    delete: {
      summary: "Supprimer une alerte",
      tag: ["Reminders"],
      description: "Supprime une alerte existante.",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: {
        "200": { description: "Alerte supprimée avec succès" },
        "404": { description: "Alerte non trouvée" },
        "500": { description: "Erreur interne du serveur" }
      }
    }
  }
};
