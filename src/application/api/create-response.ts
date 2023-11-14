import {RequestHeaders, Response} from './response';
import {HttpStatus} from './http-status';

/**
 * Response object creation helper
 * @param body
 * @param statusCode - Defaults to 'OK' / 200 status
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

    const metaHeaders: RequestHeaders = (!!process.env.X_AMZN_TRACE_ID)
        ? { _X_AMZN_TRACE_ID: process.env.X_AMZN_TRACE_ID }
        : {}

    return {
        statusCode,
        body: (body === null) ? null : JSON.stringify(body),
        headers: {
            ...accessControlAllowOriginHeader,
            ...reqHeaders,
            ...metaHeaders,
        },
    };
};
