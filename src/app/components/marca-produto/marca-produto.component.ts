import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarcaProduto } from 'src/app/model/marca-produto';

import { LoginService } from 'src/app/services/login.service';
import { MarcaProdutoService } from 'src/app/services/marca-produto.service';

@Component({
  selector: 'app-marca-produto',
  templateUrl: './marca-produto.component.html',
  styleUrls: ['./marca-produto.component.css']
})
export class MarcaProdutoComponent implements OnInit {

  lista = new Array<MarcaProduto>();
  marcaProdForm: FormGroup;
  marcaProduto: MarcaProduto;
  varPesquisa: String = '';
  qtdPagina: Number = 0;
  arrayNumber: Number[] = [];
  paginaAtual: Number = 0;

  constructor(private fb: FormBuilder, private marcaProdutoService: MarcaProdutoService, private loginService: LoginService){
    this.marcaProduto = new MarcaProduto();

      /* Obter dados do form, inicia e limpa*/
      this.marcaProdForm = this.fb.group({
        id:[],
        nomeDesc: [null, Validators.required],     
        empresa: [this.loginService.objetoEmpresa(), Validators.required]     
      });

      }

      /*Executa no momento que a tela abre*/
      ngOnInit(): void {
        this.marcaProdutoService.qtdPaginaMarca().subscribe({
          next: (res) => {

            this.qtdPagina = Number(res);
            
            this.arrayNumber = Array(this.qtdPagina).fill(0).map((x,i) => i);
          },
          error: (error) => {

          }
        });
        
        this.listaMarcas(0);      
        
      }

      atualizaQtdPagina(): void{
        this.marcaProdutoService.qtdPaginaMarca().subscribe({
          next: (res) => {

            this.qtdPagina = Number(res);
            
            this.arrayNumber = Array(this.qtdPagina).fill(0).map((x,i) => i);
          },
          error: (error) => {

          }
        });
      }

      novo(): void{
        this.marcaProdForm = this.fb.group({
          id:[],
          nomeDesc: [null, Validators.required],     
          empresa: [this.loginService.objetoEmpresa(), Validators.required]   
        });
      }

      listaMarcas(pagina: Number){
        this.marcaProdutoService.listarMarcaProduto(pagina).subscribe({

          next: (res) =>{
            this.atualizaQtdPagina();
            this.lista = res;
          },
          error: (error) =>{
            alert(error);
          }

        });
      }

    
        /*Transforma em objeto */
       marcaProdObjeto(): MarcaProduto {
          return{
            id: this.marcaProdForm.get('id')?.value!,
            nomeDesc: this.marcaProdForm.get('nomeDesc')?.value!,
            empresa: this.marcaProdForm.get('empresa')?.value!
          }

        }

        /* Salvar marca produtos */
        salvaProdMarca(){
          const marca = this.marcaProdObjeto();     
          this.marcaProdutoService.salvarMarcaProduto(marca)   

          this.novo();
          this.listaMarcas(this.paginaAtual);
                   
        }

        editarMarcaProduto(c: MarcaProduto): void{
          this.marcaProdutoService.buscarMarcaPorId(c.id).subscribe({
            next: (data) => {
              this.marcaProduto = data;
              this.marcaProdForm = this.fb.group({
                id:[this.marcaProduto.id],
                nomeDesc: [this.marcaProduto.nomeDesc, Validators.required],     
                empresa: [this.marcaProduto.empresa, Validators.required]   
              });
    
            },
            error: (error) =>{
              alert(error);
            }

          });          
         
        }

        deletarMarca(c: MarcaProduto): void {
          var confim = confirm('Deseja mesmo deletar');

          if (confim){           
            this.marcaProdutoService.deletar(c);            
            this.listaMarcas(this.paginaAtual);
          }
        }

        setPesquisa(val:String): void {
          this.varPesquisa = val;
        }
        
        pesquisar(): void{

          if(this.varPesquisa.length <=0){
            this.listaMarcas(this.paginaAtual);
            return;
          }

          this.marcaProdutoService.buscarPorDescMarca (this.varPesquisa).subscribe({

            next: (res) => {
              this.lista = res;
            },
            error: (error) => {
              alert(error);
            }

          });
        }


        buscarPagina(p: Number): void{
          this.paginaAtual = p;
          this.listaMarcas(this.paginaAtual);
        }

        voltar(){
          if(this.paginaAtual.valueOf() > 0){
            this.paginaAtual = this.paginaAtual.valueOf() - 1;
          }

          this.listaMarcas(this.paginaAtual);
        }
    
        avancar(){
          if(this.paginaAtual.valueOf() < this.qtdPagina.valueOf()){
            this.paginaAtual = this.paginaAtual.valueOf() + 1;
          }
          this.listaMarcas(this.paginaAtual);
        }

       
       
}
