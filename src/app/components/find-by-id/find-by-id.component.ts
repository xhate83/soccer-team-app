import { Component, inject, OnDestroy } from '@angular/core';
import { ITeam } from 'src/app/models/team.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule} from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { FindByIdService } from './find-by-id.service';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-find-by-id',
  templateUrl: './find-by-id.component.html',
  standalone: true,
  imports: [SharedModule, MatDialogModule],
})
export class FindByIdComponent implements OnDestroy {

  isFormtUsed = false;
  notFoundId = false;
  inputFind = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]);
  team: ITeam | null = null;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _findByIdService = inject(FindByIdService);

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  
  findById(): void {

    if (this.inputFind.invalid) return;
    const id = Number(this.inputFind.value);

    if(typeof id !== 'number' || isNaN(id)) {
      return
    }

    this.isFormtUsed = true;

    this.inputFind.disable()

    this._findByIdService.getTeamById(id).pipe(
      takeUntil(this._unsubscribeAll),
      finalize(() => { this.inputFind.enable(); })
    )
    .subscribe({
      next: (team: ITeam) => {this.team = team; this.notFoundId = false;},
      error: () => {this.team = null; this.notFoundId = true;}
    });
  
  }
}
