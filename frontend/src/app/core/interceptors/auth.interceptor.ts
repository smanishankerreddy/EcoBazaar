import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser ? localStorage.getItem('token') : null;
  const userId = isBrowser ? localStorage.getItem('userId') : null;

  if (token) {
    const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
    if (userId) headers['X-User-Id'] = userId;
    const cloned = req.clone({ setHeaders: headers });
    return next(cloned);
  }

  return next(req);
};
