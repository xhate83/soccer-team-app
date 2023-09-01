import { Component, OnDestroy, OnInit,  inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITeam, INewTeam } from 'src/app/models/team.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CreateUpdateTeamService } from './create-update-team.service';
import { SnackBarService } from '../../utilities/snack-bar/snack-bak.service';

@Component({
  selector: 'app-create-update-team',
  templateUrl: './create-update-team.component.html',
})
export class CreateUpdateTeamComponent implements OnInit, OnDestroy {

  private _route = inject(ActivatedRoute)
  private _formBuilder = inject(FormBuilder)
  private _createUpdateTeamService = inject(CreateUpdateTeamService);
  private _snackBarService = inject(SnackBarService);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  teamForm!: FormGroup;
  title = 'Crear equipo'
  icon = 'add'
  isEdit = false;
  editTeam!: ITeam;
  maxDate = new Date();

  ngOnInit(): void {

    this._createFormTeam();
    const id = this._route.snapshot.params['id'];
    if (id) {
      this._initializeEditState(parseInt(id, 10));
    }

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  findById(id: number): void {

    this._createUpdateTeamService.getTeamById(id).pipe(takeUntil(this._unsubscribeAll))
    .subscribe({
      next: (team: ITeam) => {
        this.editTeam = team;
        this.teamForm.patchValue({
          ...this.editTeam,
          fundacion: new Date(this.editTeam.fundacion?.substring(0, 19) || new Date())
        });
      },
      error: () => {this._snackBarService.openSnackBar('No se encontro el equipo', '⛔'); this.teamForm.disable()}
    });
  
  }

  onSubmit(): void {

    if(this.teamForm.invalid) {
      return;
    }
   
    if(this.isEdit) {
      if(this.editTeam) {
        this._updateTeam();
      }
        
    } else {
      this._createTeam();
    }
    
  }

  private _resetForm(): void {
    this._createFormTeam();
  }

  private _createFormTeam(): void {
    this.teamForm = this._formBuilder.group({
      nombre: [null, Validators.required],
      estadio: [null, Validators.required],
      sitioWeb: [null],
      nacionalidad: [null, Validators.required],
      fundacion: [null, Validators.required],
      entrenador: [null, Validators.required],
      capacidad: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
      valor: [null, Validators.pattern("^[0-9]*$")]
    });
  
  }

  private _createTeam(): void {

    const dateFundation = new Date(this.teamForm.get('fundacion')?.value)
    dateFundation.setUTCHours(0, 0, 0, 0);
    const newteam: INewTeam = {
      nombre: this.teamForm.get('nombre')?.value,
      estadio: this.teamForm.get('estadio')?.value,
      sitioWeb: this.teamForm.get('sitioWeb')?.value || null,
      nacionalidad: this.teamForm.get('nacionalidad')?.value,
      fundacion: dateFundation.toISOString().replace('Z', '+0000'),
      entrenador: this.teamForm.get('entrenador')?.value,
      capacidad: parseInt(this.teamForm.get('capacidad')?.value, 10),
      valor: parseInt(this.teamForm.get('valor')?.value || 0, 10)
    }
    this._createUpdateTeamService.createTeam(newteam).pipe(takeUntil(this._unsubscribeAll))
    .subscribe({
      next: () => {
        this._resetForm()
        this._snackBarService.openSnackBar('Equipo creado', '✅');
      },
      error: () => {this._snackBarService.openSnackBar('No se pudo crear el equipo', '⛔');}
    });
  }

  private _updateTeam(): void {
    const dateFundation = new Date(this.teamForm.get('fundacion')?.value)
    dateFundation.setUTCHours(0, 0, 0, 0);

    this.editTeam = {
      id: this.editTeam.id,
      nombre: this.teamForm.get('nombre')?.value,
      estadio: this.teamForm.get('estadio')?.value,
      sitioWeb: this.teamForm.get('sitioWeb')?.value || null,
      nacionalidad: this.teamForm.get('nacionalidad')?.value,
      fundacion: dateFundation.toISOString().replace('Z', '+0000'),
      entrenador: this.teamForm.get('entrenador')?.value,
      capacidad: parseInt(this.teamForm.get('capacidad')?.value, 10),
      valor: parseInt(this.teamForm.get('valor')?.value || 0, 10)
    }

    this._createUpdateTeamService.editTeam(this.editTeam.id, this.editTeam).pipe(takeUntil(this._unsubscribeAll))
    .subscribe({
      next: () => {
        this._snackBarService.openSnackBar('Equipo editado', '✅');
      },
      error: () => {this._snackBarService.openSnackBar('No se pudo editar el equipo', '⛔');}
    });
  }

  private _initializeEditState(id: number): void {
    this.isEdit = true;
    if (isNaN(id)) {
      this.title = 'Id Incorrecto';
    } else {
      this.title = `Editar equipo - Id ${id}`;
    }
    this.icon = 'edit'
    this.findById(id);
  }
  
}
