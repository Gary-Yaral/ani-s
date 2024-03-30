import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageData } from '../utilities/storage';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  if(!StorageData.get()){
    return true
  } else {
    router.navigate(['/dashboard'])
    return false
  }
};
