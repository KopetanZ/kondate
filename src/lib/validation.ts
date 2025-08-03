// Input validation utilities for API endpoints
// Provides type-safe validation and error handling

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationException extends Error {
  constructor(public errors: ValidationError[]) {
    super('Validation failed');
    this.name = 'ValidationException';
  }
}

// Common validation functions
export const validateRequired = (value: any, fieldName: string): void => {
  if (value === undefined || value === null || value === '') {
    throw new ValidationException([{ field: fieldName, message: `${fieldName} is required` }]);
  }
};

export const validateString = (value: any, fieldName: string, options: { 
  minLength?: number; 
  maxLength?: number; 
  required?: boolean;
} = {}): string => {
  if (options.required !== false) {
    validateRequired(value, fieldName);
  }
  
  if (typeof value !== 'string') {
    throw new ValidationException([{ field: fieldName, message: `${fieldName} must be a string` }]);
  }
  
  if (options.minLength && value.length < options.minLength) {
    throw new ValidationException([{ field: fieldName, message: `${fieldName} must be at least ${options.minLength} characters` }]);
  }
  
  if (options.maxLength && value.length > options.maxLength) {
    throw new ValidationException([{ field: fieldName, message: `${fieldName} must be no more than ${options.maxLength} characters` }]);
  }
  
  return value;
};

export const validateArray = (value: any, fieldName: string, options: {
  minItems?: number;
  maxItems?: number;
  required?: boolean;
} = {}): any[] => {
  if (options.required !== false) {
    validateRequired(value, fieldName);
  }
  
  if (!Array.isArray(value)) {
    throw new ValidationException([{ field: fieldName, message: `${fieldName} must be an array` }]);
  }
  
  if (options.minItems && value.length < options.minItems) {
    throw new ValidationException([{ field: fieldName, message: `${fieldName} must have at least ${options.minItems} items` }]);
  }
  
  if (options.maxItems && value.length > options.maxItems) {
    throw new ValidationException([{ field: fieldName, message: `${fieldName} must have no more than ${options.maxItems} items` }]);
  }
  
  return value;
};

export const validateNumber = (value: any, fieldName: string, options: {
  min?: number;
  max?: number;
  integer?: boolean;
  required?: boolean;
} = {}): number => {
  if (options.required !== false) {
    validateRequired(value, fieldName);
  }
  
  const num = Number(value);
  if (isNaN(num)) {
    throw new ValidationException([{ field: fieldName, message: `${fieldName} must be a number` }]);
  }
  
  if (options.integer && !Number.isInteger(num)) {
    throw new ValidationException([{ field: fieldName, message: `${fieldName} must be an integer` }]);
  }
  
  if (options.min !== undefined && num < options.min) {
    throw new ValidationException([{ field: fieldName, message: `${fieldName} must be at least ${options.min}` }]);
  }
  
  if (options.max !== undefined && num > options.max) {
    throw new ValidationException([{ field: fieldName, message: `${fieldName} must be no more than ${options.max}` }]);
  }
  
  return num;
};

export const validateEnum = <T extends string>(
  value: any, 
  fieldName: string, 
  allowedValues: readonly T[], 
  options: { required?: boolean } = {}
): T => {
  if (options.required !== false) {
    validateRequired(value, fieldName);
  }
  
  if (!allowedValues.includes(value)) {
    throw new ValidationException([{ 
      field: fieldName, 
      message: `${fieldName} must be one of: ${allowedValues.join(', ')}` 
    }]);
  }
  
  return value;
};

export const validateEmail = (value: any, fieldName: string, options: { required?: boolean } = {}): string => {
  const email = validateString(value, fieldName, options);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    throw new ValidationException([{ field: fieldName, message: `${fieldName} must be a valid email address` }]);
  }
  
  return email;
};

export const validateDate = (value: any, fieldName: string, options: { required?: boolean } = {}): Date => {
  if (options.required !== false) {
    validateRequired(value, fieldName);
  }
  
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new ValidationException([{ field: fieldName, message: `${fieldName} must be a valid date` }]);
  }
  
  return date;
};

// Recipe-specific validations
export const validateMealType = (value: any): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
  return validateEnum(value, 'mealType', ['breakfast', 'lunch', 'dinner', 'snack'] as const);
};

export const validateDifficulty = (value: any): number => {
  return validateNumber(value, 'difficulty', { min: 1, max: 5, integer: true });
};

export const validatePassword = (value: any, fieldName: string = 'password'): string[] => {
  const password = validateArray(value, fieldName, { minItems: 4, maxItems: 4 });
  
  // Ensure all items are strings (emojis)
  password.forEach((item, index) => {
    if (typeof item !== 'string') {
      throw new ValidationException([{ 
        field: `${fieldName}[${index}]`, 
        message: 'Password items must be strings (emojis)' 
      }]);
    }
  });
  
  return password;
};

// JSON validation helper
export const validateAndParseJSON = <T>(value: string, fieldName: string, fallback?: T): T => {
  try {
    return JSON.parse(value);
  } catch {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new ValidationException([{ 
      field: fieldName, 
      message: `${fieldName} must be valid JSON` 
    }]);
  }
};

// Error handling helper for API routes
export const handleValidationError = (error: unknown) => {
  if (error instanceof ValidationException) {
    return {
      success: false,
      error: 'Validation failed',
      details: error.errors
    };
  }
  
  return {
    success: false,
    error: 'Internal server error',
    details: error instanceof Error ? error.message : 'Unknown error'
  };
};