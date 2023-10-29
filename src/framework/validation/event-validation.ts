import {APIGatewayProxyEventPathParameters} from 'aws-lambda';

/**
 * Get a custom path parameter from the API Gateway Event object
 * @param pathParams
 * @param key
 * @returns The path param, or `null` if none set
 */
export function getPathParam(pathParams: APIGatewayProxyEventPathParameters | null, key: string): string | null {
  if (!pathParams
      || !key
      || typeof pathParams[key] !== 'string'
      || pathParams[key]?.trim().length === 0
  ) {
    return null;
  }

  return pathParams[key] as string;
}
