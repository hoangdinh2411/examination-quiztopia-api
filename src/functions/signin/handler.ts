import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { sendError, sendResponse } from '@libs/api-gateway';
import { middyBodyParser } from '@libs/lambda';

import schema from './schema';
import validation from 'src/helpers/validation';
import { getUser } from './model';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
const signup: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { username, password } = event.body;
    const user = await getUser(username);
    if (!user) {
      return sendError(400, `Username ${username} not exists!`);
    }
    const isMatch = await bcryptjs.compare(password, user.Password);
    if (!isMatch) {
      return sendError(400, `Password is incorrect!`);
    }

    const token = jwt.sign(
      {
        PK: user.PK,
        SK: user.SK,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );
    return sendResponse({
      message: 'Sign in successfully!',
      token,
    });
  } catch (error) {
    return sendError(error.statusCode, error.message);
  }
};

export const main = middyBodyParser(signup).use(
  validation({
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['username', 'password'],
  })
);
