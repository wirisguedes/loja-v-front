import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CategoriaProduto } from '../model/categoria-produto';
import { LoginService } from './login.service';
import { MarcaProduto } from '../model/marca-produto';

@Injectable({
  providedIn: 'root'
})
export class MarcaProdutoService {

  private urlApi = environment.urlApi;
  constructor(private http: HttpClient, private router: Router, private loginService: LoginService) { }

  deletar(m : MarcaProduto): void{
    this.http.post<String>(this.urlApi + 'deletaMarca', m).subscribe({

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

  salvarMarcaProduto(m: CategoriaProduto){

    return this.http.post<String>(this.urlApi + 'salvarMarca', m).subscribe({
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

    listarMarcaProduto(pagina: Number){
      return this.http.get<MarcaProduto[]>(this.urlApi + 'listaPorPageMarcaProduto/' + this.loginService.codEmpresa() + '/' + pagina);
          
    }

    buscarMarcaPorId(id: any){
      return this.http.get<MarcaProduto>(this.urlApi + 'obterMarcaProdutoPorId/' + id);
    }

    buscarPorDescMarca(val:String){
    
      return this.http.get<MarcaProduto[]>(this.urlApi + 'buscarPorDescMarca/' + val + '/' + this.loginService.codEmpresa());

    }

    qtdPaginaMarca(){
      return this.http.get<BigInteger>(this.urlApi + 'qtdPaginaMarcaProduto/' + this.loginService.codEmpresa());
    }

   
}
