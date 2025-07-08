import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class AllExceptionFilter implements ExceptionFilter{
  catch(exception:unknown, host:ArgumentsHost){
    // const args = host.getArgs() gives [req, res, next]

    const ctx = host.switchToHttp()    
    const response = ctx.getResponse();  // get response
    const request = ctx.getRequest()   // get request 
    const status =                     // get status from exception
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
 
    const message =                    // get message from exception
      exception instanceof HttpException
        ? exception.getResponse()
        : exception;
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,                     // extract path from request 
      message,
    });
  }
}