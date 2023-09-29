import { sendError, sendResponse } from '@libs/api-gateway';

import db from '@libs/db';
import middy from '@middy/core';
const getLeaderBoard = async (event) => {
  const { quizId } = event.pathParameters;
  const quizPK = 'QUIZ#' + quizId;
  try {
    const data = await db
      .query({
        TableName: process.env.TABLE,
        IndexName: 'LEADER_BOARD_INDEX',
        ExpressionAttributeNames: {
          '#LEADER_BOARD_PK': 'LEADER_BOARD_PK',
          '#username': 'Username',
          '#score': 'Score',
        },
        KeyConditionExpression: '#LEADER_BOARD_PK = :LEADER_BOARD_PK',
        ExpressionAttributeValues: {
          ':LEADER_BOARD_PK': quizPK,
        },
        Limit: 5,
        ScanIndexForward: false,
        ProjectionExpression: '#username, #score',
      })
      .promise();
    if (data.Items.length === 0) {
      return sendResponse({
        message: 'There is no record for this quiz',
      });
    }
    return sendResponse({
      message:
        'Get leader board with all users who have score more than 8 for the quiz successfully',
      data: data.Items,
    });
  } catch (error) {
    console.log(error);
    return sendError(error.statusCode, error.message);
  }
};

export const main = middy(getLeaderBoard);
