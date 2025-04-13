import { genSalt, hash, compare } from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const SALT = await genSalt();
  return await hash(password, SALT);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await compare(password, hash);
}
