import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { sendError, sendResponse } from '@libs/api-gateway';
import { middyBodyParser } from '@libs/lambda';

import schema from './schema';
import validation from 'src/helpers/validation';
import checkToken from 'src/middleware/auth';
import { createNewOrUpdateExistentRecord } from './model';
const addRecordForQuiz: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const { score, quizId } = event.body;
  const quizPK = 'QUIZ#' + quizId;
  try {
    if (score <= 0) {
      return sendError(400, 'Score must be greater than 0! Please try again!');
    }
    await createNewOrUpdateExistentRecord(
      quizPK,
      score,
      event.user.PK,
      event.user.Username
    );
    return sendResponse({
      success: true,
      message: 'Save new record in leader board for the quiz successfully!',
    });
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      error.message = 'Sorry,The record is not better than the old one!';
    }
    return sendError(error.statusCode, error.message);
  }
};

export const main = middyBodyParser(addRecordForQuiz)
  .use(checkToken())
  .use(
    validation({
      properties: {
        score: { type: 'number' },
        quizId: { type: 'string' },
      },
      required: ['score', 'quizId'],
    })
  );
