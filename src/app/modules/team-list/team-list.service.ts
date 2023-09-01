import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { config } from '../../../app/core/config';

@Injectable({
  providedIn: 'root'
})
export class TeamListService {

  private _httpClient = inject(HttpClient)

  public getTeams(page: number = 0, pageSize = 10): Observable<any>
  {
    return this._httpClient.get(`${config.apiUrl}equipos/listar/${page}/${pageSize}`);
  }

  public deleteTeam(id: number): Observable<any> {
    return this._httpClient.delete(`${config.apiUrl}equipos/eliminar/${id}`);
  }

}
