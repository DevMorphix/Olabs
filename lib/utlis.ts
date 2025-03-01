/**
 * Utility functions for API calls and debugging
 */

/**
 * Clean and validate a MongoDB ID
 * 
 * @param id The ID string to validate
 * @returns Cleaned ID string
 * @throws Error if ID is invalid
 */
export function validateMongoId(id: string | undefined | null): string {
  if (!id) throw new Error("ID is required");
  
  // Clean the ID (remove any whitespace)
  const cleanId = String(id).trim();
  
  // Basic validation - MongoDB IDs are 24 hex chars
  if (!/^[0-9a-fA-F]{24}$/.test(cleanId)) {
    throw new Error(`Invalid ID format: ${cleanId}`);
  }
  
  return cleanId;
}

/**
 * Check if an API response contains an error
 */
export function isApiError(response: any): boolean {
  return !!(
    response?.error || 
    response?.status >= 400 ||
    response?.message?.includes("error")
  );
}

/**
 * Format error details for logging
 */
export function formatErrorForLog(error: any): Record<string, any> {
  return {
    message: error?.message || "Unknown error",
    status: error?.response?.status,
    data: error?.response?.data,
    stack: error?.stack?.split('\n').slice(0, 3).join('\n')
  };
}
