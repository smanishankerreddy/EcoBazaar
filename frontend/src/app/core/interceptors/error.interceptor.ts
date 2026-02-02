import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { throwError, catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Log error to console for now
      // We'll add MatSnackBar later after confirming app works
      console.error('HTTP Error:', error);
      
      let message = 'An error occurred';
      if (error.error?.message) {
        message = error.error.message;
      } else if (error.statusText) {
        message = error.statusText;
      }
      
      console.error('Error message:', message);
      return throwError(() => error);
    })
  );
};
