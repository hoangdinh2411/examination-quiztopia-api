import db from '@libs/db';
import bcryptjs from 'bcryptjs';

export const saveUser = async (username: string, password: string) => {
  var salt = bcryptjs.genSaltSync(10);
  var hash = bcryptjs.hashSync(password, salt);
  const Id = 'USER#' + username;

  return await db
    .put({
      TableName: process.env.TABLE,
      Item: {
        PK: Id,
        SK: Id,
        Password: hash,
        Username: username,
      },
      ConditionExpression: 'attribute_not_exists(PK)',
    })
    .promise();
};
