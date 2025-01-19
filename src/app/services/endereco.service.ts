import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Endereco } from '../model/endereco';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {

  private urlApi = environment.urlApi;
    constructor(private http: HttpClient, private router: Router, private loginService: LoginService) { }

   excluirEndereco(e : Endereco): void{
      this.http.post<String>(this.urlApi + 'deleteEndereco', e).subscribe({
  
        next: (res) => {
          var varResposta = JSON.stringify(res);
          var jsonResposta = JSON.parse(varResposta);
  
          if(jsonResposta.error != undefined){
            alert(jsonResposta.error); 
          }else{
            alert(res);
          }
        },
        error: (error) => {        
          alert(error.error.error);
        }
  
      });
    }


}
