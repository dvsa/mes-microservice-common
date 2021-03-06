import { APIGatewayEventRequestContext } from 'aws-lambda';

/**
 * Get the current authenticated user's staff number, reading from the request context.
 * @param requestContext The request context
 * @returns The staff number, or ``null`` if none set
 */
export function getStaffNumberFromRequestContext(requestContext: APIGatewayEventRequestContext): string | null {
  if (requestContext && requestContext.authorizer && typeof requestContext.authorizer.staffNumber === 'string') {
    return requestContext.authorizer.staffNumber;
  }
  return null;
}
