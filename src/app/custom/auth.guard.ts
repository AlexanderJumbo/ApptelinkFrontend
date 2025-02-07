import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router)
  const _apiService = inject(ApiService)

  return _apiService.validateToken().pipe(
    map(value => {
      if (value) {
        console.log("🚀 ~ value:", value)
        return true;
      } else {
        _router.navigate([""]);
        return false;
      }
    }),
  )

};
