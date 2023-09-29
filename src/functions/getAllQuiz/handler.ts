import { sendError, sendResponse } from '@libs/api-gateway';

import db from '@libs/db';
import middy from '@middy/core';
const deleteQuiz = async (event) => {
  try {
    const data = await db
      .query({
        TableName: process.env.TABLE,
        IndexName: 'GSI_1',
        KeyConditionExpression: 'GSI_1_PK = :pk',
        ExpressionAttributeValues: {
          ':pk': 'QUIZ',
        },
        ExpressionAttributeNames: {
          '#quizId': 'QuizId',
          '#name': 'Name',
          '#username': 'Username',
          '#userId': 'UserId',
        },
        ProjectionExpression: '#quizId, #name, #username,#userId',
      })
      .promise();

    return sendResponse({ data: data.Items });
  } catch (error) {
    console.log(error);
    return sendError(error.statusCode, error.message);
  }
};

export const main = middy(deleteQuiz);
