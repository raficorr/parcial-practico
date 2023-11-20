/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { BussinessError } from '../shared/errors/business-errors';

@Injectable()
export class BusinessErrorsInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
     return next.handle()
       .pipe(catchError(error => {
         if (error.type === BussinessError.NOT_FOUND)
             throw new HttpException(error.message, HttpStatus.NOT_FOUND);
         else if (error.type === BussinessError.PRECONDITION_FAILED)
             throw new HttpException(error.message, HttpStatus.PRECONDITION_FAILED);
         else if (error.type === BussinessError.BAD_REQUEST)
             throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
         else
             throw error;
       }));
   }
}