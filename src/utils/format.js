export const formatValidationErrors = (error) => {
  // Expecting a ZodError; produce a readable structure
  if (!error || !error.issues) return 'Validation failed';

  if (Array.isArray(error.issues)) {
    // Return an array of messages keyed by path
    return error.issues.map((issue) => ({
      path: issue.path?.join('.') || '',
      message: issue.message,
      code: issue.code,
    }));
  }

  return JSON.stringify(error);
};
