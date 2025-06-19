import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  //   catch(exception: unknown, host: ArgumentsHost): void {
  //     const ctx = host.switchToHttp();
  //     const response = ctx.getResponse<Response>();
  //     const request = ctx.getRequest<Request>();

  //     let status = HttpStatus.INTERNAL_SERVER_ERROR;
  //     let message = 'Internal server error';
  //     let error = 'InternalServerError';

  //     if (exception instanceof HttpException) {
  //       status = exception.getStatus();
  //       const res = exception.getResponse();

  //       if (typeof res === 'string') {
  //         message = res;
  //       } else if (typeof res === 'object' && res !== null) {
  //         const responseObj = res as Record<string, unknown>;
  //         if (typeof responseObj.message === 'string') {
  //           message = responseObj.message;
  //         }
  //         if (typeof responseObj.error === 'string') {
  //           error = responseObj.error;
  //         }
  //       }
  //     }

  //     response.status(status).json({
  //       statusCode: status,
  //       message,
  //       error,
  //       timestamp: new Date().toISOString(),
  //       path: request.url,
  //     });
  //   }
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    console.error('❌ Caught by Exception Filter:', exception); // 👈 log it

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
