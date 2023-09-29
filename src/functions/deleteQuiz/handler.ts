import { sendError, sendResponse } from '@libs/api-gateway';

import checkToken from 'src/middleware/auth';
import middy from '@middy/core';
import {
  createDeleteRequests,
  deleteQuestionsAndRecords,
  deleteQuizOnTable,
  getAllQuestionOfQuiz,
  getAllRecordOfQuiz,
} from './model';
const deleteQuiz = async (event) => {
  const { quizId } = event.pathParameters;
  const quizPK = 'QUIZ#' + quizId;
  try {
    await deleteQuizOnTable(quizPK, event.user.PK);

    const questionData = await getAllQuestionOfQuiz(quizPK);

    const recordData = await getAllRecordOfQuiz(quizPK);
    if (questionData.length !== 0 && recordData.length !== 0) {
      const deleteRequests = createDeleteRequests(
        [...questionData, ...recordData],
        quizPK
      );

      await deleteQuestionsAndRecords(deleteRequests);
    }
    return sendResponse({
      message: 'Delete quiz and all questions of the quiz successfully!',
    });
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      error.message = 'Quiz is not exist or you are not authorized!';
    }
    return sendError(error.statusCode, error.message);
  }
};

export const main = middy(deleteQuiz).use(checkToken());
