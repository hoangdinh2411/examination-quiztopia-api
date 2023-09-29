import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { sendError, sendResponse } from '@libs/api-gateway';
import { middyBodyParser } from '@libs/lambda';

import schema from './schema';
import validation from 'src/helpers/validation';
import { saveUser } from './model';
const signup: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { username, password } = event.body;

    await saveUser(username, password);
    return sendResponse({ message: 'Signup successfully!' });
  } catch (error) {
    console.log(error);
    if (error.code === 'ConditionalCheckFailedException') {
      error.message = 'Username already exists!';
    }

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
