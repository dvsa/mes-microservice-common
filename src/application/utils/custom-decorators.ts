import {error} from "./logger";
import {createResponse} from "../api/create-response";
import {HttpStatus} from "../api/http-status";
import {ExaminerRole} from "../../domain/examiner-role";
import {getRoleFromRequestContext} from "../../framework/security/authorisation";

/**
 * Decorator method used to validate path parameters being defined
 * If there are no pathParameters - Return 400
 * If the specified pathParameter is not defined - Return 400
 * @param {string} paramName
 * @constructor
 */
export function NonNullPathParam<T>(paramName: string) {
    return function (_target: T, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const event = args[0];

            // Check if the event and pathParameters are defined
            if (!event || !event.pathParameters) {
                error('Event object or path parameters are missing.');
                return createResponse('Event object or path parameters are missing.', HttpStatus.BAD_REQUEST);
            }

            // Check for the specific path parameter
            if (!event.pathParameters[paramName]) {
                error('Path parameter not defined', paramName);
                return createResponse(`Path parameter is required: ${paramName}`, HttpStatus.BAD_REQUEST);
            }

            // Call the original method if the check passes
            return originalMethod.apply(this, args);
        };
    };
}

/**
 * Decorator method used to validate whether the defined role is equal to the request context
 * If there is no role in request context or the role is not equal to passed examinerRole - Return 401
 * @param {ExaminerRole} examinerRole
 * @constructor
 */
export function ValidateRole<T>(examinerRole: ExaminerRole) {
    return function (_target: T, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const event = args[0];

            const role = getRoleFromRequestContext(event.requestContext);
            if (!role || (role !== examinerRole)) {
                error('Examiner role is not authorised for this request.', {required: examinerRole, actual: role});
                return createResponse('Examiner role is not authorised for this request.', HttpStatus.UNAUTHORIZED);
            }

            // Call the original method if the check passes
            return originalMethod.apply(this, args);
        };
    };
}

/**
 * Decorator method used to validate path parameters using a validator function
 * If there are no pathParameters - Return 400
 * If param does not return truth from the validator function - Return 400
 * @param {string} param
 * @param {Function} validator
 * @constructor
 */
export function ValidatePathParam<T>(param: string, validator: Function) {
    return function (_target: T, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const event = args[0];

            if (!event || !event.pathParameters) {
                error('Event object or path parameters are missing.');
                return createResponse('Event object or path parameters are missing.', HttpStatus.BAD_REQUEST);
            }

            const pathParam = event.pathParameters[param];

            if (!validator(pathParam)) {
                error('Path parameter is invalid.', {param, value: pathParam});
                return createResponse(`Path parameter failed validation: \"${param}\"`, HttpStatus.BAD_REQUEST);
            }

            // Call the original method if the check passes
            return originalMethod.apply(this, args);
        };
    };
}
