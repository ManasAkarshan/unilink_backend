// // src/interceptors/transform.interceptor.ts
// import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
// import path from 'path';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
//
// @Injectable()
// export class TransformInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     return next.handle().pipe(
//       map(data => ({
//         statusCode: context.switchToHttp().getResponse().statusCode,
//         path: context.switchToHttp().getRequest().url,
//         data,
//       })),
//     );
//   }
// }