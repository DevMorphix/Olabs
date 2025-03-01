/**
 * Validates subject data before API submission
 * @param data Subject data to validate
 * @returns Object with validation results
 */
export const validateSubjectData = (data: any) => {
  const errors: Record<string, string> = {};
  
  // Required fields - check for title field
  if (!data.title || data.title.trim() === '') {
    errors.title = 'Subject name is required';
  }
  
  // Check if title is at least 2 characters
  if (data.title && data.title.trim().length < 2) {
    errors.title = 'Subject name must be at least 2 characters';
  }
  
  // Check if class_id is provided and not empty when selected
  if (data.class_id !== undefined && data.class_id !== '' && data.class_id.trim() === '') {
    errors.class_id = 'Please select a valid class';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Formats subject data to match API requirements
 * @param data Raw subject data
 * @returns Formatted data
 */
export const formatSubjectData = (data: any) => {
  // Map our form fields to what the API expects
  return {
    // The API expects "title" not "subject_name"
    title: data.title?.trim(),
    description: data.description?.trim() || '',
    class_id: data.class_id || null,
  };
};
