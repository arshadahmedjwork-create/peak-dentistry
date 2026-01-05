/**
 * Centralized error handler to prevent leaking sensitive information
 * Maps technical error codes to user-friendly messages
 */

export const getSafeErrorMessage = (error: any): string => {
  // Extract error code from various error formats
  const errorCode = error?.code || error?.status || error?.error_code || 'UNKNOWN';
  const errorMessage = error?.message || '';
  
  // Map PostgreSQL and Supabase error codes to safe messages
  const errorMap: Record<string, string> = {
    // PostgreSQL constraint violations
    '23505': 'This information is already in use.',
    '23503': 'Cannot complete this operation due to related records.',
    '23502': 'Required information is missing.',
    '23514': 'The provided data does not meet requirements.',
    
    // Supabase/PostgREST errors
    'PGRST116': 'Access denied.',
    'PGRST301': 'Invalid request. Please check your input.',
    '42501': 'You do not have permission to perform this action.',
    '42P01': 'The requested resource is not available.',
    
    // Authentication errors
    'auth/user-already-exists': 'An account with this email already exists.',
    'auth/invalid-email': 'Please provide a valid email address.',
    'auth/weak-password': 'Please choose a stronger password.',
    'auth/invalid-credentials': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/user-not-found': 'Invalid email or password.',
    'auth/wrong-password': 'Invalid email or password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    
    // Storage errors
    'storage/unauthorized': 'You do not have permission to access this file.',
    'storage/object-not-found': 'The requested file could not be found.',
    'storage/bucket-not-found': 'Storage location not available.',
  };
  
  // Check for exact code match first
  if (errorMap[errorCode]) {
    return errorMap[errorCode];
  }
  
  // Check for Supabase auth error patterns in message
  if (errorMessage.includes('User already registered')) {
    return 'An account with this email already exists.';
  }
  if (errorMessage.includes('Invalid login credentials')) {
    return 'Invalid email or password.';
  }
  if (errorMessage.includes('Email not confirmed')) {
    return 'Please confirm your email address before logging in.';
  }
  if (errorMessage.includes('violates row-level security')) {
    return 'You do not have permission to perform this action.';
  }
  if (errorMessage.includes('violates unique constraint')) {
    return 'This information is already in use.';
  }
  if (errorMessage.includes('violates foreign key constraint')) {
    return 'Cannot complete this operation due to related records.';
  }
  
  // Default safe message
  return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
};

/**
 * Logs error details for debugging while returning safe message for users
 * Use this in catch blocks to ensure errors are logged but not exposed
 */
export const handleError = (error: any, context: string): string => {
  // Log full error details for debugging (only in development/server logs)
  console.error(`[${context}]`, {
    message: error?.message,
    code: error?.code,
    status: error?.status,
    details: error?.details,
    hint: error?.hint,
  });
  
  return getSafeErrorMessage(error);
};
