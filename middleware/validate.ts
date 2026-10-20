import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

type RequestSource = 'body' | 'query' | 'params';

/**
 * Parses `req[source]` with a Zod schema and replaces it with the parsed
 * value, so handlers only ever see validated, coerced data. A ZodError is
 * passed to the error handler, which answers 400 with per-field details.
 */
export function validate(schema: ZodType, source: RequestSource = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed: unknown = schema.parse(req[source]);
    if (source === 'body') {
      req.body = parsed;
    } else {
      // Express 5 exposes `req.query` as a getter-only property, so assignment
      // would throw; define an own property that shadows it instead.
      Object.defineProperty(req, source, { value: parsed, writable: true, configurable: true });
    }
    next();
  };
}
