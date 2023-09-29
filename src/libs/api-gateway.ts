import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';
import { IUser } from 'src/types/user.type';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
  user?: IUser;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export const sendResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      ...response,
      success: true,
    }),
  };
};

export const sendError = (statusCode: number, message: string) => {
  return {
    statusCode: statusCode || 500,
    body: JSON.stringify({
      message,
    }),
  };
};
