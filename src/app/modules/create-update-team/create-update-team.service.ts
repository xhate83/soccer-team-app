import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { config } from '../../../app/core/config';
import { INewTeam, ITeam } from '../../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class CreateUpdateTeamService {

  private _httpClient = inject(HttpClient)

  public getTeamById(id: number):Observable<ITeam>
  {
    return this._httpClient.get<ITeam>(`${config.apiUrl}equipos/consultar/${id}`);
  }

  public createTeam(team: INewTeam):Observable<INewTeam>
  {
    return this._httpClient.post<INewTeam>(`${config.apiUrl}equipos/crear`, team);
  }

  public editTeam(id: number, team: ITeam):Observable<ITeam> {
    return this._httpClient.put<ITeam>(`${config.apiUrl}equipos/actualizar/${id}`, team);
  }
}
