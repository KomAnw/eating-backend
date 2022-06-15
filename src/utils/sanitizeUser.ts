import { User, UserDocument } from 'src/schemas/user.schema';

export const sanitizeUser = (user: UserDocument) => {
  const sanitized = user.toObject();
  delete sanitized['password'];
  return sanitized;
};
