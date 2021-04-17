import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Signosvitales } from '../_model/signosvitales';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SignosvitalesService extends GenericService<Signosvitales> {

  constructor(protected http:HttpClient) {
      super(http,`${environment.HOST}/signos-vitales`);
   }

   listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

}
