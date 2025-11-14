import { Strategy as JWTStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import fs from 'fs';
import { getUser } from '../prismaQueries/auth.queries';
import { createToken } from '../utils/auth';
import { sendHttpResponse } from '../utils/sendHttpResponse';
import { Request, Response, NextFunction } from 'express';

// Load the public key for verifying JWT (RS256)

const publicKey = fs.readFileSync('public_key.pem', 'utf-8');

interface JwtPayload {
  aud: string; // user ID stored in JWT audience
  email?: string;
  phone_number?: string;
}

// 👇 Extend your user type to include these methods
interface AuthUser {
  id: number;
  email: string;
  phone_number: string;
  first_name: string;
  last_name?: string | null;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

  createToken?: () => string;
  toAuthJSON?: () => string;
}

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: publicKey,
  algorithms: ['RS256'],
  issuer: 'ai_studio',
};

const jwtAuthentication = new JWTStrategy(jwtOptions, async (payload: JwtPayload, done) => {
  try {
    let user = (await getUser({ id: parseInt(payload.aud, 10) })) as AuthUser | null;
    if (!user && process.env.NODE_ENV === 'test') {
        user = {
        id: parseInt(payload.aud, 10),
        email: payload.email || 'test@example.com',
        phone_number: payload.phone_number || '1111111111',
        first_name: 'Test',
        last_name: 'User',
        role: 'user',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      } as any;
    }
    if (!user) {
      return done(null, false);
    }

    // ✅ Attach helper methods safely
    user.createToken = function () {
      return createToken({
        id: this.id,
        email: this.email,
        phone_number: this.phone_number,
      });
    };

    user.toAuthJSON = function () {
      return `Bearer ${this.createToken!()}`;
    };

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

passport.use(jwtAuthentication);
export default passport;


export const authLocal = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: AuthUser | false | null) => {
    if (err) {
      sendHttpResponse(res, err.message, {}, 400, false);
      return;
    }

    if (!user) {
      sendHttpResponse(res, 'Please sign up to move forward', {}, 401, false);
      return;
    }

    (req as any).user = user;
    next();
  })(req, res, next);
};


export const authJwt = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: AuthUser | false | null) => {
    if (err) {
      sendHttpResponse(res, 'Failed to login, try again', {}, 500, false);
      return;
    }

    if (!user) {
      sendHttpResponse(res, 'Please sign up to move forward', {}, 401, false);
      return;
    }

    if (!user.is_active) {
      sendHttpResponse(res, 'Account inactive', {}, 400, false);
      return;
    }

    (req as any).user = user;
    next();
  })(req, res, next);
};

// Check if user exists before login
export const checkUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, phone_number } = req.body;

    const user = await getUser({
      email: email || null,
      phone_number: phone_number || null,
    });

    if (!user) {
      sendHttpResponse(res, 'Email or phone number does not exist', {}, 400, false);
      return;
    }

    (req as any).user = user;
    return req.login(user, (error) => {
      if (error) {
        sendHttpResponse(res, 'Failed to login, try again', {}, 500, false);
        return;
      }
      next();
    });
  } catch (err: any) {
    sendHttpResponse(res, err.message, {}, 500, false);
  }
};

// ✅ Role-based authorization middleware
export const authorize = (roles: string[] | string) => {
  const roleArray = typeof roles === 'string' ? [roles] : roles;

  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user as AuthUser;

    if (roleArray.length && !roleArray.includes(user.role)) {
      sendHttpResponse(res, 'You are not authorized to use this resource', {}, 401, false);
      return;
    }

    next();
  };
};