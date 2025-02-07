import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.indexOf("authenticate") > 0) return next(req);

  const token = localStorage.getItem("token");
  const cloneRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })

  return next(cloneRequest);
};
