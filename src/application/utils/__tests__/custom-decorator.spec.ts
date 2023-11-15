import {
    APIGatewayEventRequestContextWithAuthorizer,
    APIGatewayProxyEvent,
    APIGatewayProxyEventPathParameters,
} from 'aws-lambda';
import {NonNullPathParam, ValidatePathParam, ValidateRole} from "../custom-decorators";
import * as resp from "../../api/create-response";
import {ExaminerRole} from "../../../domain/examiner-role";
import {HttpStatus} from "../../api/http-status";

describe('CustomDecorators', () => {
    beforeEach(() => {
        spyOn(resp, 'createResponse');
    });

    describe('NonNullPathParam', () => {
        class TestClass {
            @NonNullPathParam('testParam')
            async handler(event: APIGatewayProxyEvent) {
                return {statusCode: 200};
            }
        }

        it('should return 400 error with object/param missing message', async () => {
            await new TestClass().handler({pathParameters: null} as APIGatewayProxyEvent);
            expect(resp.createResponse).toHaveBeenCalledWith(
                'Event object or path parameters are missing.', HttpStatus.BAD_REQUEST,
            );
        });

        it('should continue with handler code if passes decorator checks', async () => {
            const data = await new TestClass().handler({
                pathParameters: {testParam: 'test'} as APIGatewayProxyEventPathParameters,
            } as APIGatewayProxyEvent);

            expect(data.statusCode).toEqual(200);
        });
    });

    describe('ValidateRole', () => {
        class TestClass {
            @ValidateRole(ExaminerRole.DE)
            async handler(event: APIGatewayProxyEvent) {
                return {statusCode: 200};
            }
        }

        it('should return 401 with examiner role error', async () => {
            await new TestClass().handler({} as APIGatewayProxyEvent);
            expect(resp.createResponse).toHaveBeenCalledWith(
                'Examiner role is not authorised for this request.', HttpStatus.UNAUTHORIZED,
            );
        });

        it('should continue with handler code if passes decorator checks', async () => {
            const data = await new TestClass().handler({
                requestContext: {
                    authorizer: {examinerRole: ExaminerRole.DE},
                } as APIGatewayEventRequestContextWithAuthorizer<any>,
            } as APIGatewayProxyEvent);

            expect(data.statusCode).toEqual(200);
        });
    });

    describe('ValidatePathParam', () => {
        class TestClass {
            @ValidatePathParam<TestClass>('test', (param: string) => param === '1234')
            async handler(event: APIGatewayProxyEvent) {
                return {statusCode: 200};
            }
        }

        it('should return 400 with invalid error', async () => {
            await new TestClass().handler({
                pathParameters: {'something': '1234'} as APIGatewayProxyEventPathParameters,
            } as APIGatewayProxyEvent);
            expect(resp.createResponse).toHaveBeenCalledWith(
                'Path parameter failed validation: "test"', HttpStatus.BAD_REQUEST,
            );
        });

        it('should continue with handler code if passes decorator checks', async () => {
            const data = await new TestClass().handler({
                pathParameters: {'test': '1234'} as APIGatewayProxyEventPathParameters,
            } as APIGatewayProxyEvent);

            expect(data.statusCode).toEqual(200);
        });
    });
});
