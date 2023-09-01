import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { config } from '../../../app/core/config';
import { ITeam } from '../../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class FindByIdService {

  private _httpClient = inject(HttpClient)

  public getTeamById(id: number):Observable<ITeam>
  {
    return this._httpClient.get<ITeam>(`${config.apiUrl}equipos/consultar/${id}`);
  }
}
