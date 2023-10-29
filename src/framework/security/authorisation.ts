import { APIGatewayEventRequestContext } from 'aws-lambda';
import { ExaminerRole } from '../../domain/examiner-role';

/**
 * Get the current authenticated users staff number, reading from the request context.
 * @param requestContext The request context
 * @returns The staff number, or ``null`` if none set
 */
export function getStaffNumberFromRequestContext(requestContext: APIGatewayEventRequestContext): string | null {
  if (requestContext?.authorizer && typeof requestContext.authorizer.staffNumber === 'string') {
    return requestContext.authorizer.staffNumber;
  }
  return null;
}

/**
 * Get the current authenticated users examiner role, reading from the request context.
 * @param requestContext The request context
 * @returns The examiner role, or ``null`` if none set
 */
export const getRoleFromRequestContext = (requestContext: APIGatewayEventRequestContext): ExaminerRole | null => {
  if (requestContext?.authorizer && typeof requestContext.authorizer.examinerRole === 'string') {
    return requestContext.authorizer.examinerRole as ExaminerRole;
  }
  return null;
};
