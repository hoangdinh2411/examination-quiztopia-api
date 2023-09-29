import { sendError, sendResponse } from '@libs/api-gateway';

import db from '@libs/db';
import middy from '@middy/core';
import checkToken from 'src/middleware/auth';
const getAllQuizByUsername = async (event) => {
  try {
    const data = await db
      .query({
        TableName: process.env.TABLE,
        IndexName: 'GSI_1',
        ExpressionAttributeNames: {
          '#PK': 'GSI_1_PK',
          '#SK': 'GSI_1_SK',
          '#quizId': 'QuizId',
          '#name': 'Name',
          '#username': 'Username',
        },
        KeyConditionExpression: '#PK = :pk AND #SK = :sk',
        ExpressionAttributeValues: {
          ':pk': 'QUIZ',
          ':sk': event.user.PK,
        },
        ProjectionExpression: '#quizId, #name, #username',
      })
      .promise();
    if (data.Items.length === 0) {
      return sendResponse({ message: 'There is no quiz' });
    }
    return sendResponse({ data: data.Items });
  } catch (error) {
    console.log(error);
    return sendError(error.statusCode, error.message);
  }
};

export const main = middy(getAllQuizByUsername).use(checkToken());
