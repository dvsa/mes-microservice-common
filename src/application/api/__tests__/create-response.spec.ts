import {createResponse} from "../create-response";
import {HttpStatus} from "../http-status";

describe('createResponse', () => {
    it('should create a response with 200 status code when no status code is specified', () => {
        const response = createResponse({});
        expect(response.statusCode).toBe(HttpStatus.OK);
    });

    it('should create a response with custom status code when specified', () => {
        const response = createResponse({}, HttpStatus.BAD_REQUEST);
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should successfully create a response for a body of type string', () => {
        const response = createResponse('Some body');
        expect(response.body).toEqual('"Some body"');
    });

    it('should successfully create a response for a null body', () => {
        const response = createResponse(null);
        expect(response.body).toEqual(null);
    });

    it('should successfully create a response for a complex body', () => {
        const obj = { key: 'value' };
        const response = createResponse(obj);
        expect(response.body).toEqual(JSON.stringify(obj));
    });
});
