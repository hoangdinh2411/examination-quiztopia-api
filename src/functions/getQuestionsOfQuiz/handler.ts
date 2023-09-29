import { sendError, sendResponse } from '@libs/api-gateway';

import db from '@libs/db';
import middy from '@middy/core';
const getQuestionsOfQuiz = async (event) => {
  const { quizId } = event.pathParameters;
  const quizPK = 'QUIZ#' + quizId;
  try {
    const data = await db
      .scan({
        TableName: process.env.TABLE,
        IndexName: 'GSI_1',
        ExpressionAttributeNames: {
          '#PK': 'GSI_1_PK',
          '#SK': 'GSI_1_SK',
          '#questionId': 'QuestionId',
          '#question': 'Question',
          '#answer': 'Answer',
          '#location': 'Location',
        },
        FilterExpression: '#PK = :PK AND #SK = :SK',
        ExpressionAttributeValues: {
          ':PK': 'QUESTION',
          ':SK': quizPK,
        },
        ProjectionExpression: '#questionId, #question, #answer, #location',
      })
      .promise();
    return sendResponse({ data: data.Items });
  } catch (error) {
    console.log(error);
    return sendError(error.statusCode, error.message);
  }
};

export const main = middy(getQuestionsOfQuiz);
