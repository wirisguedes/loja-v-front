import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaProduto } from 'src/app/model/categoria-produto';
import { CategoriaProdutoService } from 'src/app/services/categoria-produto.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-categoria-produto',
  templateUrl: './categoria-produto.component.html',
  styleUrls: ['./categoria-produto.component.css']
})
export class CategoriaProdutoComponent implements OnInit {

  lista = new Array<CategoriaProduto>();
  catProdForm: FormGroup;
  catProduto: CategoriaProduto;
  varPesquisa: String = '';
  qtdPagina: Number = 0;
  arrayNumber: Number[] = [];
  paginaAtual: Number = 1;

  constructor(private fb: FormBuilder, private categoriaProdutoService: CategoriaProdutoService, private loginService: LoginService){
    this.catProduto = new CategoriaProduto();

      /* Obter dados do form, inicia e limpa*/
      this.catProdForm = this.fb.group({
        id:[],
        nomeDesc: [null, Validators.required],     
        empresa: [this.loginService.objetoEmpresa(), Validators.required]     
      });

      }

      /*Executa no momento que a tela abre*/
      ngOnInit(): void {
        this.categoriaProdutoService.qtdPagina().subscribe({
          next: (res) => {

            this.qtdPagina = Number(res);
            
            this.arrayNumber = Array(this.qtdPagina).fill(0).map((x,i) => i);
          },
          error: (error) => {

          }
        });
        
        this.listaCategoria(1);      
        
      }

      novo(): void{
        this.catProdForm = this.fb.group({
          id:[],
          nomeDesc: [null, Validators.required],     
          empresa: [this.loginService.objetoEmpresa(), Validators.required]   
        });
      }

      listaCategoria(pagina: Number){
        this.categoriaProdutoService.listarCategoriaProduto(pagina).subscribe({

          next: (res) =>{
            this.lista = res;
          },
          error: (error) =>{
            alert(error);
          }

        });
      }

    
        /*Transforma em objeto */
       catProdObjeto(): CategoriaProduto {
          return{
            id: this.catProdForm.get('id')?.value!,
            nomeDesc: this.catProdForm.get('nomeDesc')?.value!,
            empresa: this.catProdForm.get('empresa')?.value!
          }

        }

        /* Salvar categoria produtos */
        cadProdCategoria(){
          const categoria = this.catProdObjeto();     
          this.categoriaProdutoService.salvarCategoriaProduto(categoria)   

          this.novo();
          this.listaCategoria(this.paginaAtual);
                   
        }

        editarCategoriaProduto(c: CategoriaProduto): void{
          this.categoriaProdutoService.buscarPorId(c.id).subscribe({
            next: (data) => {
              this.catProduto = data;
              this.catProdForm = this.fb.group({
                id:[this.catProduto.id],
                nomeDesc: [this.catProduto.nomeDesc, Validators.required],     
                empresa: [this.catProduto.empresa, Validators.required]   
              });
    
            },
            error: (error) =>{
              alert(error);
            }

          });          
         
        }

        deletar(c: CategoriaProduto): void {
          var confim = confirm('Deseja mesmo deletar');

          if (confim){           
            this.categoriaProdutoService.deletar(c);            
            this.listaCategoria(this.paginaAtual);
          }
        }

        setPesquisa(val:String): void {
          this.varPesquisa = val;
        }
        
        pesquisar(): void{

          if(this.varPesquisa.length <=0){
            this.listaCategoria(this.paginaAtual);
            return;
          }

          this.categoriaProdutoService.buscarPorDesc(this.varPesquisa).subscribe({

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
          this.listaCategoria(this.paginaAtual);
        }

        voltar(){
          if(this.paginaAtual.valueOf() > 0){
            this.paginaAtual = this.paginaAtual.valueOf() - 1;
          }

          this.listaCategoria(this.paginaAtual);
        }
    
        avancar(){
          if(this.paginaAtual.valueOf() < this.qtdPagina.valueOf()){
            this.paginaAtual = this.paginaAtual.valueOf() + 1;
          }
          this.listaCategoria(this.paginaAtual);
        }
       
}
