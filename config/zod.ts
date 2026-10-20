import { z } from 'zod';

z.config({
  customError: (issue) => {
    if (issue.input !== undefined) {
      return undefined;
    }

    const field = issue.path?.at(-1);
    return typeof field === 'string' ? `${field} is required` : 'Field is required';
  },
});
