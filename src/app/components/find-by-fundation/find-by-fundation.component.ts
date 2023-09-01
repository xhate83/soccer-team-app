import { Component, inject, OnDestroy } from '@angular/core';
import { ITeam } from 'src/app/models/team.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FindByFundationService } from './find-by-fundation.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-find-by-fundation',
  templateUrl: './find-by-fundation.component.html',
  standalone: true,
  imports: [SharedModule, MatDialogModule, MatDatepickerModule],
})
export class FindByFundationComponent implements OnDestroy {

  isFormtUsed = false;
  loading = false;
  teams: ITeam[] = [];
  maxDate = new Date();
  formGroup = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required])
  });
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _findByFundationService = inject(FindByFundationService);
  private _datePipe = inject(DatePipe);

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  
  findByFundation(): void {
    
    if (this.formGroup.invalid) return;

    this.isFormtUsed = true;
    this.loading = true;
    this.formGroup.disable();

    const dateStart = this._datePipe.transform(this.formGroup.get('startDate')?.value, 'dd-MM-yyyy') ?? '' ;
    const dateEnd = this._datePipe.transform(this.formGroup.get('endDate')?.value, 'dd-MM-yyyy') ?? '';

    console.log(dateStart, dateEnd);
    
    this._findByFundationService.getTeamByFundation(dateStart, dateEnd).pipe(takeUntil(
      this._unsubscribeAll),
      finalize(() => {
        this.formGroup.enable();
        this.loading = false;
      }))
    .subscribe({
      next: (teams: ITeam[]) => this.teams = teams,
      error: () => this.teams = [],
    });
  
  }
}