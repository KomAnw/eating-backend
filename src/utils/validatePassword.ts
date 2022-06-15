import * as bcrypt from 'bcrypt';

export const validatePassword = async (
  incomingPassword: string,
  dbPassword: string,
) => {
  return await bcrypt.compare(incomingPassword, dbPassword);
};
