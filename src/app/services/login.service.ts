import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../model/usuario';
import { Router } from '@angular/router';
import { PessoaJuridica } from '../model/pessoa-juridica';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private urlApi = environment.urlApi;

  constructor(private http: HttpClient, private router: Router) { }

  usuarioLogado(){
    var autorization = ''+ localStorage.getItem('Authorization');

    return autorization !== '' && autorization !== null && autorization !== 'null';
  }

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

  codEmpresa(){
    return localStorage.getItem("empresa");
  }

  objetoEmpresa(): PessoaJuridica{
   return new PessoaJuridica(Number(this.codEmpresa()));
  }

  logar(usuario: Usuario){
    return this.http.post<String>(this.urlApi + 'login', usuario).subscribe({

      next: (res) => {
        var respjson = JSON.stringify(res);
        var jwt = JSON.parse(respjson);
        localStorage.setItem("Authorization",jwt.Authorization);
        localStorage.setItem("username",jwt.username);
        localStorage.setItem("empresa", jwt.empresa);

        this.router.navigate(['home']);
      },

      error: (error) => {
        console.info(error)
        alert('Erro: ' + error.error.text)
      }
    })
  }

  deslogar(): void {
    localStorage.setItem("Authorization",'');
    localStorage.setItem("username",'');

    this.router.navigate(['login']);
  }

}
