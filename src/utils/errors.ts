import { logger } from './logger.js';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

export class NetworkError extends AppError {
  constructor(message: string) {
    super(message, 503, 'NETWORK_ERROR');
  }
}

export function handleError(error: Error | AppError): void {
  if (error instanceof AppError) {
    logger.error(error.message, {
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
      stack: error.stack
    });
  } else {
    logger.error(error.message, {
      stack: error.stack
    });
  }
}

interface ApiErrorResponse {
  error?: {
    message?: string;
    code?: string;
    details?: Record<string, unknown>;
  };
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({} as ApiErrorResponse));
    const errorResponse = errorData as ApiErrorResponse;
    const message = errorResponse.error?.message || response.statusText;
    const code = errorResponse.error?.code;
    const details = errorResponse.error?.details;

    switch (response.status) {
      case 400:
        throw new ValidationError(message, details);
      case 401:
        throw new AuthenticationError(message);
      case 403:
        throw new AuthorizationError(message);
      case 404:
        throw new NotFoundError(message);
      case 503:
        throw new NetworkError(message);
      default:
        throw new AppError(message, response.status, code, details);
    }
  }

  const data = await response.json();
  return data as T;
}

export function assertNonNullish<T>(
  value: T | null | undefined,
  message: string
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new ValidationError(message);
  }
}

export function assertCondition(
  condition: boolean,
  message: string
): asserts condition {
  if (!condition) {
    throw new ValidationError(message);
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorResponse(error: unknown) {
  if (isAppError(error)) {
    return {
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details
      }
    };
  }

  // For unknown errors, return a generic error response
  return {
    error: {
      message: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
      statusCode: 500
    }
  };
} 