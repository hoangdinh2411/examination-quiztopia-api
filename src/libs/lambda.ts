import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { IUser } from 'src/types/user.type';

export interface APIGatewayProxyEventWithUser extends APIGatewayProxyEvent {
  user: IUser;
}

export const middyBodyParser = (handler) => {
  return middy(handler).use(middyJsonBodyParser());
};
