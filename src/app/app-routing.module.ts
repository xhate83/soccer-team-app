import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authenticationGuard } from './core/guards';



const routes: Routes = [
  {
    path: '', pathMatch : 'full', redirectTo: 'team-list'
  },
  {
    path: 'team-list', loadChildren: () => import('./modules/team-list/team-list.module').then(m => m.TeamListModule)
  },
  {
    path: 'create-update-team', canActivate: [authenticationGuard()], loadChildren: () => import('./modules/create-update-team/create-update-team.module').then(m => m.CreateUpdateTeamModule)
  },
  { path: '**',  redirectTo: 'team-list'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
