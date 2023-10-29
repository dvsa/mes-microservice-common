import {RequestHeaders, Response} from './response';
import {HttpStatus} from './http-status';

/**
 * Response object creation helper
 * @param body
 * @param statusCode
 * @param reqHeaders
 * @returns {Response}
 */
export const createResponse = <T>(
    body: T,
    statusCode: HttpStatus = HttpStatus.OK,
    reqHeaders: RequestHeaders = {},
): Response<string | null> => {
    const accessControlAllowOriginHeader = {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    };

    return {
        statusCode,
        headers: {...accessControlAllowOriginHeader, ...reqHeaders},
        body: (body === null) ? null : JSON.stringify(body),
    };
};
