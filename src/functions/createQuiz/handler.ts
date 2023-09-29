import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { sendError, sendResponse } from '@libs/api-gateway';
import { middyBodyParser } from '@libs/lambda';

import schema from './schema';
import validation from 'src/helpers/validation';
import checkToken from 'src/middleware/auth';
import db from '@libs/db';
import { generateRandomId } from 'src/helpers/functions';
const createQuiz: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const QuizId = generateRandomId();
  const PK = 'QUIZ#' + QuizId;
  const userPK = event.user.PK;
  try {
    await db
      .put({
        TableName: process.env.TABLE,
        Item: {
          PK,
          SK: userPK,
          QuizId,
          Name: event.body.name,
          GSI_1_PK: 'QUIZ',
          GSI_1_SK: userPK,
          Username: event.user.Username,
          UserId: event.user.PK,
        },
        ConditionExpression: 'attribute_not_exists(PK)',
      })
      .promise();

    return sendResponse({
      message: 'Created quiz successfully!',
    });
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      error.message = 'Question id was duplicated! Please try again!';
    }
    return sendError(error.statusCode, error.message);
  }
};

export const main = middyBodyParser(createQuiz)
  .use(checkToken())
  .use(
    validation({
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
    })
  );
