import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { sendError, sendResponse } from '@libs/api-gateway';
import { middyBodyParser } from '@libs/lambda';

import schema from './schema';
import validation from 'src/helpers/validation';
import checkToken from 'src/middleware/auth';
import db from '@libs/db';
import { generateRandomId } from 'src/helpers/functions';
const addQuestionForQuiz: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const {
    question,
    answer,
    location: { latitude, longitude },
    quizId,
  } = event.body;
  const QuestionId = generateRandomId();
  const quizPK = `QUIZ#${quizId}`;
  const PK = `QUESTION#${QuestionId}`;
  try {
    const { Item: currentQuiz } = await db
      .get({
        TableName: process.env.TABLE,
        Key: {
          PK: quizPK,
          SK: event.user.PK,
        },
      })
      .promise();
    if (!currentQuiz) {
      return sendError(
        400,
        'Quiz is not exist or you are not authorized to add question for this quiz!'
      );
    }

    await db
      .put({
        TableName: process.env.TABLE,
        Item: {
          PK,
          SK: quizPK,
          Question: question,
          GSI_1_PK: 'QUESTION',
          GSI_1_SK: quizPK,
          QuestionId,
          Answer: answer,
          Location: {
            latitude,
            longitude,
          },
        },
        ConditionExpression: 'attribute_not_exists(PK)',
      })
      .promise();
    return sendResponse({
      message: 'Added question in quiz successfully!',
    });
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      error.message = 'try again!';
    }
    return sendError(error.statusCode, error.message);
  }
};

export const main = middyBodyParser(addQuestionForQuiz)
  .use(checkToken())
  .use(
    validation({
      properties: {
        question: { type: 'string' },
        answer: { type: 'string' },
        location: {
          type: 'object',
          properties: {
            latitude: { type: 'number' },
            longitude: { type: 'number' },
          },
        },
        quizId: { type: 'string' },
      },
      required: ['question', 'answer', 'location', 'quizId'],
    })
  );
