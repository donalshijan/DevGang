import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthChildGuard implements CanActivateChild {
  constructor(private authService: AuthService, private router: Router,@Inject(PLATFORM_ID) private platformId: Object) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn().pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          console.log('inside gaurd')
          return true;
        } else {
          return this.router.createUrlTree(['/login']); // Use UrlTree for redirects
        }
      }),
      catchError(() => {
        return of(this.router.createUrlTree(['/login'])); // Handle potential errors in authentication logic
      })
    );
  }
}
