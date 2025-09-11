export class ApiKeyNotConfiguredError extends Error {
  constructor() {
    super("API key is not configured");
    this.name = "ApiKeyNotConfiguredError";
  }
}
