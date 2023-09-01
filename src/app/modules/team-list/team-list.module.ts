import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamListComponent } from './team-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Route } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HeaderComponent } from '../../components/header/header.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfitmationComponent } from '../../utilities/confirmation/confitmation.component';

const routes: Route[] = [
  {
    path: '',
    component: TeamListComponent
  }
]

@NgModule({
  declarations: [
    TeamListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatPaginatorModule,
    HeaderComponent,
    MatDialogModule,
    ConfitmationComponent
    
  ]
})
export class TeamListModule { }
