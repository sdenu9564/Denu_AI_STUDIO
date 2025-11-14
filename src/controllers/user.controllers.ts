import { Request, Response } from "express";
import { sendHttpResponse } from "../utils/sendHttpResponse";
import * as AuthQueries from '../prismaQueries/auth.queries';
import { toAuthJSON } from "../utils/auth";
import bcrypt from 'bcrypt';

export const SingUpNewUser = async(req : Request, res: Response): Promise<void> => {
    try {
        const {name, email, phone_number, password} = req.body as {
            name : string,
            email : string,
            phone_number : string,
            password : string
        };

        const user = await AuthQueries.getUser({email, phone_number});
        if (user) {
            sendHttpResponse(res, 'Your account is already created', {}, 400, false);
            return;
        }
        const [first_name, last_name] = name.split(' ');
         const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await AuthQueries.createUser(first_name!, last_name!, email!, phone_number!,hashedPassword)
        const token = toAuthJSON(newUser);
        res.setHeader("Authorization", `Bearer ${token}`);
        sendHttpResponse(res, "Success",{});
    } catch (err : any) {
        console.error(
            'err --------- SingUpNewUser ------ user.controller.ts',
            err?.message
        );
        sendHttpResponse(res, 'Failed to create user', {}, 500, false);
    }
};


export const Signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await AuthQueries.getUser({ email });

    if (!user) {
      sendHttpResponse(res, 'User not found!', {}, 400, false);
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      sendHttpResponse(res, 'Invalid credentials', {}, 401, false);
      return;
    }
    const { password: _pw, ...safeUser } = user;
    const token = toAuthJSON(user);
    res.setHeader('Authorization', token);

    sendHttpResponse(res, 'Login success', {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      created_at : user?.created_at,
      phone_number : user?.phone_number,
      email: user.email,
    });
  } catch (err) {
    console.error('err --------- signin -------- user.controller.ts', err);
    sendHttpResponse(res, 'Server error', {}, 500, false);
  }
};