export default {
  RegisterRequest: {
    type: "object",
    properties: {
      username: { type: "string", example: "john_doe" },
      email: { type: "string", format: "email", example: "john@example.com" },
      password: { type: "string", format: "password", example: "mypassword123" }
    },
    required: ["username", "email", "password"]
  },
  LoginRequest: {
    type: "object",
    properties: {
      username: { type: "string", example: "john_doe" },
      password: { type: "string", format: "password", example: "mypassword123" }
    },
    required: ["username", "password"]
  },
  AuthResponse: {
    type: "object",
    properties: {
      name: { type: "string", example: "john_doe" },
      accessToken: { type: "string", example: "Bearer eyJhbGciOi..." },
      refreshToken: { type: "string", example: "refresh_token_example" }
    }
  }
};
