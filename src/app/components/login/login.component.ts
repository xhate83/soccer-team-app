import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, finalize  } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { SnackBarService } from '../../utilities/snack-bar/snack-bak.service';
import { IUser } from '../../models/user.model';
import { AuthService } from '../../core/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [SharedModule, MatDialogModule],
})
export class LoginComponent implements OnDestroy {

  
  dialogRef = inject(MatDialogRef<LoginComponent>);
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _snackBarService = inject(SnackBarService);
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  loginForm: FormGroup = this._formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required]
  });

 
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const user: IUser = {
      ...this.loginForm.value
    }
    this._authService.login(user).pipe(
      takeUntil(this._unsubscribeAll),
      finalize(() => {
        this.loginForm.enable();
      }))
    .subscribe({
      next: () => {
        this._snackBarService.openSnackBar('Ingreso satisfactorio', '✅');
        this.loginForm.disable();
        this.dialogRef.close();
      },
      error: () => {this._snackBarService.openSnackBar('No se pudo ingresar', '⛔')}
    })
   
  }

}
