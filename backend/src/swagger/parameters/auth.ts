export default {
  RefreshTokenHeader: {
    name: "x-refresh-token",
    in: "header",
    description: "Refresh token",
    required: true,
    schema: { type: "string" }
  }
};
