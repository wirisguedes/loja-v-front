import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';
import { PessoaJuridica } from '../model/pessoa-juridica';
import { PessoaJuridicaComponent } from '../components/pessoa-juridica/pessoa-juridica.component';

@Injectable({
  providedIn: 'root'
})
export class PessoaJuridicaService {

  private urlApi = environment.urlApi;
  constructor(private http: HttpClient, private router: Router, private loginService: LoginService) { }

  deletePessoaJuridica(p : PessoaJuridica): void{
    this.http.post<String>(this.urlApi + 'deletePessoaJuridica', p).subscribe({

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

  salvarPj(p: PessoaJuridica){
    return this.http.post<String>(this.urlApi + 'salvarPj', p).subscribe({
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

    salvarPj2(p: PessoaJuridica, c: PessoaJuridicaComponent){

      return this.http.post<String>(this.urlApi + 'salvarPj', p).subscribe({
         next: (res) => {
      
            var varResposta = JSON.stringify(res);
            var jsonResposta = JSON.parse(varResposta);
      
            if (jsonResposta.error != undefined){
              alert(jsonResposta.error);
            }else{
              c.novo();
              alert('Salvo com sucesso: ID: ' + jsonResposta.id);
            }
      
         },
         error: (error) => {
          
          console.info(error.error.error);
          alert(error.error.error);
         }
      
      });
      
      }

    listaPorPagePj(pagina: Number){
      return this.http.get<PessoaJuridica[]>(this.urlApi + 'listaPorPagePj/' + this.loginService.codEmpresa() + '/' + pagina);
          
    }

    buscarPjId(id: any){
      return this.http.get<PessoaJuridica>(this.urlApi + 'buscarPjId/' + id);
    }

    buscarPorNomePj(val:String){
    
      return this.http.get<PessoaJuridica[]>(this.urlApi + 'buscarPorNomePj/' + val + '/' + this.loginService.codEmpresa());

    }

    qtdPaginaPj(){
      return this.http.get<BigInteger>(this.urlApi + 'qtdPaginaPj/' + this.loginService.codEmpresa());
    }

   
}
