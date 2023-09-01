import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FindByIdComponent } from '../../components/find-by-id/find-by-id.component';
import { FindByFundationComponent } from '../../components/find-by-fundation/find-by-fundation.component';
import { LoginComponent } from '../../components/login/login.component';
import { AuthService } from '../../core/auth.service';
import { Subject, takeUntil, Observable} from 'rxjs';
import { SnackBarService } from '../../utilities/snack-bar/snack-bak.service';
import { IUser } from '../../models/user.model';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {

  user: IUser | null = null;
  isLogged = false;
  private _dialog = inject(MatDialog);
  private _authService = inject(AuthService);
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _snackBarService = inject(SnackBarService);
  private _router = inject(Router);

  ngOnInit(): void {
    this._authService.isLoggedIn()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(isLoggedIn => {
        this.isLogged = isLoggedIn;
        this.user = isLoggedIn ? this._authService.getUser() : null;
      });

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  openModalFindById(): void{
    this._dialog.open(FindByIdComponent,{ autoFocus: false});
  }

  openModalFindByFundation(): void{ 
    this._dialog.open(FindByFundationComponent, { autoFocus: false});
  }

  openModalLogin(): void{
    this._dialog.open(LoginComponent, { autoFocus: false});
  }

  logOut(): void{ 
    this._authService.logout().pipe(takeUntil(this._unsubscribeAll))
    .subscribe({
      next: () => {
        this._snackBarService.openSnackBar('Salida satisfactoria', '✅');
        this._router.navigate(['/']);
      },
      error: () => {this._snackBarService.openSnackBar('No se pudo salir', '⛔')}
    })
  }

}
