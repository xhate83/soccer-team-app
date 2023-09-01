import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUpdateTeamComponent } from './create-update-team.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Route } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HeaderComponent } from '../../components/header/header.component';

const routes: Route[] = [
  {
    path: '',
    component: CreateUpdateTeamComponent
  },
  {
    path: ':id',
    component: CreateUpdateTeamComponent
  }
]


@NgModule({
  declarations: [
    CreateUpdateTeamComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatDatepickerModule,
    HeaderComponent
  ]
})
export class CreateUpdateTeamModule { }
