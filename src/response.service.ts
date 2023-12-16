import { Injectable } from "@nestjs/common";

interface Responses<T> {
  statusCode: number;
  message: string;
  content: T | string;
  dateTime: string;
  messageConstants: any;
}
@Injectable()
class ResponseService {
  createResponse<T>(
    statusCode: number,
    message: string, 
    content: T,
  ) {
    return {
      statusCode,
      message,
      content, 
      dateTime: new Date().toISOString(),
      messageConstants: null
    }
  }

}