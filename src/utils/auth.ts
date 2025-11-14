import jwt,  { SignOptions } from 'jsonwebtoken';
import fs from 'fs';
import constants from '../config/constants';
import path from 'path';

// Read the private key as a Buffer (RS256 requires it)
const privateKeyPath = path.resolve(__dirname, '../../private_key.pem');
const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');

// Define the type for user
interface JwtUser {
  id: number;
  email: string;
  phone_number: string;
}

export const createToken = (user: JwtUser): string => {
  const expiresIn: NonNullable<SignOptions['expiresIn']> =
    (constants.JWT_EXPIRATION as any) || '2d';

  const signOptions: SignOptions = {
    issuer: 'ai_studio',
    audience: String(user.id),
    expiresIn,
    algorithm: 'RS256',
  };

  return jwt.sign(
    {
      email: user.email,
      phone_number: user.phone_number,
    },
    privateKey as jwt.Secret,
    signOptions
  );
};


export const toAuthJSON = (user : JwtUser) : string => {
    return `${createToken(user)}`
}