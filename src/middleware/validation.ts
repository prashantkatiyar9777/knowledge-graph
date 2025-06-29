import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError, ZodIssue, z } from 'zod';
import { ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;
        logger.warn('Validation error', { 
          path: req.path, 
          errors: zodError.errors 
        });
        
        const details = zodError.errors.map((issue: ZodIssue) => ({
          path: issue.path.join('.'),
          message: issue.message,
          code: issue.code
        }));
        
        next(new ValidationError('Invalid request data', { details }));
      } else {
        next(error);
      }
    }
  };
};

// Example schema for a table
export const tableSchema = {
  body: {
    create: z.object({
      name: z.string().min(1).max(100),
      alternativeNames: z.array(z.string()).optional(),
      sourceId: z.string().uuid(),
      description: z.string().optional(),
      fields: z.array(z.object({
        name: z.string().min(1).max(100),
        type: z.string(),
        isRequired: z.boolean().default(false),
        description: z.string().optional()
      })).optional()
    }),
    update: z.object({
      name: z.string().min(1).max(100).optional(),
      alternativeNames: z.array(z.string()).optional(),
      description: z.string().optional(),
      fields: z.array(z.object({
        name: z.string().min(1).max(100),
        type: z.string(),
        isRequired: z.boolean(),
        description: z.string().optional()
      })).optional()
    })
  },
  params: z.object({
    id: z.string().uuid()
  })
}; 