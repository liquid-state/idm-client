export const createIDMError = (message: string, response?: Response) => ({
  message: `IDM Error: ${message}`,
  response,
});
