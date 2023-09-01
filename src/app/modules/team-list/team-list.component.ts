import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ITeam } from '../../models/team.model';
import { Observable, Subject, finalize, takeUntil } from 'rxjs';
import { TeamListService } from './team-list.service';
import { SnackBarService } from '../../utilities/snack-bar/snack-bak.service';
import { IDataPaginacion } from 'src/app/models/pagination.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfitmationComponent } from 'src/app/utilities/confirmation/confitmation.component';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
})
export class TeamListComponent implements OnDestroy, OnInit {

  @ViewChild('matPaginator', {static: false}) matPaginator!: MatPaginator;
  displayedColumns: string[] = ['id', 'nombre', 'estadio', 'sitioWeb', 'nacionalidad', 'fundacion', 'entrenador', 'capacidad', 'valor', 'botones' ];
  dataSource: ITeam[] = [];
  isLogged = true;
  loadingList = false;
  dataPagination: IDataPaginacion = {
    current_page: 0,
    total_pages: 0,
    total_elements: 0
  }
  pageSizeDefault = 5
  isLoggedIn!: Observable<boolean>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _teamListService = inject(TeamListService);
  private _snackBarService = inject(SnackBarService);
  private _matDialog = inject(MatDialog);
  private _authService = inject(AuthService);


  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn();
    this.getTeams(0, this.pageSizeDefault);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onPageChange(event: any): void {
    this.getTeams(event.pageIndex, event.pageSize);
  }

  private getTeams(page: number, pageSize: number): void {
    this.loadingList = true;
    this._teamListService.getTeams(page,pageSize).pipe(
      takeUntil(this._unsubscribeAll),
      finalize(() => {this.loadingList = false;})
    )
    .subscribe((teams: any) => {
        this.dataSource = teams?.content || [];
        this.dataPagination = {
          current_page: teams?.number || 0,
          total_pages: teams?.totalPages || 0,
          total_elements: teams?.totalElements || 0
        }
    });
  }

  deleteTeam(team: ITeam): void {

    const dialog  = this._matDialog.open(ConfitmationComponent, {
       autoFocus: false,
       data: `¿Estas seguro de eliminar el equipo ${team.nombre} con ID ${team.id}?`
    })

    dialog.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {
      if (res) {
        this._teamListService.deleteTeam(team.id).pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: () => {
            this._snackBarService.openSnackBar('Equipo eliminado', '✅');
            this.getTeams(this.matPaginator?.pageIndex || 0, this.matPaginator?.pageSize || this.pageSizeDefault);
          },
          error: () => {
            this._snackBarService.openSnackBar(`No se pudo eliminar`, '⛔');
          }
        })
      }
    });

   
  }

}
