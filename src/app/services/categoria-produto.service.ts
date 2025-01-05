import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CategoriaProduto } from '../model/categoria-produto';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProdutoService {

  private urlApi = environment.urlApi;
  constructor(private http: HttpClient, private router: Router, private loginService: LoginService) { }

  salvarCategoriaProduto(categoriaProduto: CategoriaProduto){

    return this.http.post<String>(this.urlApi + 'salvarCategoria', categoriaProduto).subscribe({
       next: (res) => {    
          var varResposta = JSON.stringify(res);
          var jsonResposta = JSON.parse(varResposta);    
          if (jsonResposta.error != undefined){
            alert(jsonResposta.error);            
          }else{
            alert('Salvo com sucesso: ID: ' + jsonResposta.id);
          }
    
       },
       error: (error) => {
        
        console.info(error.error.error);
        alert(error.error.error);
       }
    
    });
    
    }

    listarCategoriaProduto(){
      return this.http.get<CategoriaProduto[]>(this.urlApi + 'listarCategoriaProduto/' + this.loginService.codEmpresa());
          
    }

    buscarPorId(id: any){
      return this.http.get<CategoriaProduto>(this.urlApi + 'buscarPorId/' + id);
    }
}
