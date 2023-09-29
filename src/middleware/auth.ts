import { sendError } from '@libs/api-gateway';
import db from '@libs/db';
import { APIGatewayProxyEventWithUser } from '@libs/lambda';
import middy from '@middy/core';
import { APIGatewayProxyResult } from 'aws-lambda';
import jwt from 'jsonwebtoken';

const checkToken = () => {
  const before: middy.MiddlewareFn<
    APIGatewayProxyEventWithUser,
    APIGatewayProxyResult
  > = async (request) => {
    try {
      const { authorization } = request.event.headers;

      const token = authorization?.split(' ')[1];
      if (!token) {
        return sendError(400, 'Token is required');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return sendError(401, 'Token is invalid');
      }

      const data = await db
        .get({
          TableName: process.env.TABLE,
          Key: {
            PK: decoded.PK,
            SK: decoded.SK,
          },
        })
        .promise();
      if (!data.Item) {
        return sendError(401, 'Token is invalid');
      }
      request.event.user = Object(data.Item);

      return request.response;
    } catch (error) {
      return sendError(400, error.message);
    }
  };

  return {
    before,
  };
};

export default checkToken;
