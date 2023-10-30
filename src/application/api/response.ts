import {HttpStatus} from './http-status';

export interface Response<T> {
    body: T;
    statusCode: HttpStatus;
    headers: RequestHeaders;
}

export interface RequestHeaders {
    [id: string]: string;
}
