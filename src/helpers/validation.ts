import { sendError } from '@libs/api-gateway';
import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

interface IValidation {
  properties: {
    [key: string]: {
      type: string | object | number | boolean;
      properties?: {
        [key: string]: {
          type: string | object | number | boolean;
        };
      };
    };
  };
  required: string[];
}
const numberRegex = /^\/(\d+)$/;
const validation = (schema: IValidation) => {
  const middleware = () => {
    const before: middy.MiddlewareFn<
      APIGatewayProxyEvent,
      APIGatewayProxyResult
    > = async (request) => {
      const body = request.event.body;
      const bodyProperties = Object.keys(body);
      const missingProperty = schema.required.find((key) => {
        return !body[key] || !bodyProperties.includes(key);
      });

      if (missingProperty) {
        return sendError(400, missingProperty + ' required');
      }
      const incorrectProperty = schema.required.find((key) => {
        if (schema.properties[key].type === 'number') {
          return numberRegex.test(body[key]);
        }
        return typeof body[key] !== schema.properties[key].type;
      });
      if (incorrectProperty) {
        return sendError(
          400,
          incorrectProperty +
            ' must be ' +
            schema.properties[incorrectProperty]?.type +
            ' type'
        );
      }
      return request.response;
    };

    return {
      before,
    };
  };

  return middleware();
};

export default validation;
