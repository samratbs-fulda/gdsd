export class Response {
    message: string;
    statusCode: number;

    constructor(statusCode: number, message: string) {
        this.statusCode = statusCode;
        this.message = message;
    }
}