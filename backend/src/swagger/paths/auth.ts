export default {
  "/auth/register": {
    post: {
      summary: "Register a new user",
      tags: ["Auth"],
      description: "Crée un nouvel utilisateur dans le système.",
      requestBody: {
        description: "Données d'inscription de l'utilisateur",
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RegisterRequest" }
          }
        }
      },
      responses: {
        "201": {
          description: "Utilisateur créé avec succès",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" }
            }
          }
        },
        "400": { description: "Requête invalide" },
        "500": { description: "Erreur interne du serveur" }
      }
    }
  },
  "/auth/login": {
    post: {
      summary: "Log in an existing user",
      tags: ["Auth"],
      description: "Authentifie un utilisateur et retourne les tokens.",
      requestBody: {
        description: "Identifiants de connexion de l'utilisateur",
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginRequest" }
          }
        }
      },
      responses: {
        "200": {
          description: "Connexion réussie",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" }
            }
          }
        },
        "401": { description: "Non autorisé" },
        "400": { description: "Requête invalide" },
        "500": { description: "Erreur interne du serveur" }
      }
    }
  },
  "/auth/refresh": {
    get: {
      summary: "Refresh JWT tokens",
      tags: ["Auth"],
      description: "Génère de nouveaux tokens d'accès et de rafraîchissement à partir d'un refresh token valide.",
      parameters: [
        {
          name: "x-refresh-token",
          in: "header",
          description: "Refresh token",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        "200": {
          description: "Tokens rafraîchis avec succès",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" }
            }
          }
        },
        "401": { description: "Token de rafraîchissement invalide ou expiré" },
        "500": { description: "Erreur interne du serveur" }
      }
    }
  }
};
