import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const { body } = req;

      // check  that  the  data  exists 
    if (!body || Object.keys(body).length === 0) {
      throw new BadRequestException('Request body is missing');
    }

    //  check  if required   fields exist
    if (!body.name || !body.email) {
      throw new BadRequestException('Missing required fields: name or email');
    }

    // Verify data (eg email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      throw new BadRequestException('Invalid email format');
    }

    next();
  }
}


export const isValidObjectId = (id: string): boolean => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;  // التحقق من تنسيق ObjectId
  if (!objectIdRegex.test(id)) {
    throw new BadRequestException('Invalid ID format');
  }
  return true;
};

