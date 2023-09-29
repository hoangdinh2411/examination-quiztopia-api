import db from '@libs/db';

export const getExistentRecord = async (quizPK: string, userPK: string) => {
  return await db
    .query({
      TableName: process.env.TABLE,
      IndexName: 'GSI_1',
      ExpressionAttributeNames: {
        '#GSI_1_PK': 'GSI_1_PK',
        '#GSI_1_SK': 'GSI_1_SK',
        '#PK': 'PK',
      },
      KeyConditionExpression:
        '#GSI_1_PK = :GSI_1_PK   AND #GSI_1_SK = :GSI_1_SK',
      FilterExpression: '#PK = :PK',
      ExpressionAttributeValues: {
        ':GSI_1_PK': 'RECORD',
        ':GSI_1_SK': quizPK,
        ':PK': 'RECORD#' + userPK,
      },
    })
    .promise();
};

export const updateExistentRecordWithHigherScore = async (
  PK: string,
  SK: string,
  newScore: number
) => {
  await db
    .update({
      TableName: process.env.TABLE,
      Key: {
        PK,
        SK,
      },
      ConditionExpression: 'attribute_exists(PK) AND Score < :newScore',
      UpdateExpression:
        'set Score = :newScore , FinishedAt = :finishedAt, LEADER_BOARD_SK = :newScore',
      ExpressionAttributeValues: {
        ':newScore': newScore,
        ':finishedAt': new Date().toISOString(),
      },
    })
    .promise();
};

export const createNewOrUpdateExistentRecord = async (
  quizPK: string,
  newScore: number,
  userPK: string,
  username: string
) => {
  const PK = `RECORD#${userPK}`;
  await db
    .put({
      TableName: process.env.TABLE,
      Item: {
        PK,
        SK: quizPK,
        Score: newScore,
        FinishedAt: new Date().toISOString(),
        LEADER_BOARD_PK: quizPK,
        LEADER_BOARD_SK: newScore,
        Username: username,
        GSI_1_PK: 'RECORD',
        GSI_1_SK: quizPK,
      },
      ConditionExpression: 'attribute_not_exists(Score) OR Score < :newScore',
      ExpressionAttributeValues: {
        ':newScore': newScore,
      },
    })
    .promise();
};
