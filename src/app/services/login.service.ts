import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private urlApi = environment.urlApi + 'login';

  constructor(private http: HttpClient) { }

  recuperarSenha(login: String) {

    return this.http.post<String>(this.urlApi + 'recuperarSenha', login).subscribe({

       next: (res) => {
          
        var respJson = JSON.stringify(res);
        var resposta = JSON.parse(respJson);

          alert(resposta.msg);
       },
       error: (error) => {
         var respJson = JSON.stringify(error);
         var resposta = JSON.parse(respJson);

          alert(resposta.msg);
       }

    });
  }

  logar(usuario: Usuario){
    return this.http.post<String>(this.urlApi, usuario).subscribe({

      next: (res) => {
        var respjson = JSON.stringify(res);
        var jwt = JSON.parse(respjson);
        localStorage.setItem("Authorization",jwt.Authorization);
      },

      error: (error) => {
        console.info(error)
        alert('Erro: ' + error.error.text)
      }
    })
  }


}
