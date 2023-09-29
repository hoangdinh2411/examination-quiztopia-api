import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import db from '@libs/db';

export const deleteQuizOnTable = async (PK: string, SK: string) => {
  return await db
    .delete({
      TableName: process.env.TABLE,
      Key: {
        PK,
        SK,
      },
      ConditionExpression: 'attribute_exists(PK) AND SK = :SK',
      ExpressionAttributeValues: {
        ':SK': SK,
      },
    })
    .promise();
};

export const getAllQuestionOfQuiz = async (quizPK: string) => {
  const data = await db
    .query({
      TableName: process.env.TABLE,
      IndexName: 'GSI_1',
      ExpressionAttributeNames: {
        '#GSI_1_PK': 'GSI_1_PK',
        '#GSI_1_SK': 'GSI_1_SK',
        '#PK': 'PK',
      },
      KeyConditionExpression: '#GSI_1_PK = :GSI_1_PK AND #GSI_1_SK = :GSI_1_SK',
      ExpressionAttributeValues: {
        ':GSI_1_PK': 'QUESTION',
        ':GSI_1_SK': quizPK,
      },
      ProjectionExpression: '#PK',
    })
    .promise();
  return data.Items ? data.Items : [];
};

export const getAllRecordOfQuiz = async (quizPK: string) => {
  const data = await db
    .query({
      TableName: process.env.TABLE,
      IndexName: 'GSI_1',
      ExpressionAttributeNames: {
        '#GSI_1_PK': 'GSI_1_PK',
        '#GSI_1_SK': 'GSI_1_SK',
        '#PK': 'PK',
      },
      KeyConditionExpression: '#GSI_1_PK = :GSI_1_PK AND #GSI_1_SK = :GSI_1_SK',
      ExpressionAttributeValues: {
        ':GSI_1_PK': 'RECORD',
        ':GSI_1_SK': quizPK,
      },
      ProjectionExpression: '#PK',
    })
    .promise();
  return data.Items ? data.Items : [];
};

type Item = {
  PK: string;
};
export const createDeleteRequests = (
  items: DocumentClient.ItemList,
  quizPK: string
) => {
  return items.map((item) => ({
    DeleteRequest: {
      Key: {
        PK: item.PK,
        SK: quizPK,
      },
    },
  }));
};

export const deleteQuestionsAndRecords = async (
  deleteRequests: DocumentClient.BatchWriteItemRequestMap['RequestItems']
) => {
  await db
    .batchWrite({
      RequestItems: {
        [process.env.TABLE]: deleteRequests,
      },
    })
    .promise();
};
