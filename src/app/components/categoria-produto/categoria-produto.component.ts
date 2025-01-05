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
        this.listaCategoria();      
        
      }

      novo(): void{
        this.catProdForm = this.fb.group({
          id:[],
          nomeDesc: [null, Validators.required],     
          empresa: [this.loginService.objetoEmpresa(), Validators.required]   
        });
      }

      listaCategoria(){
        this.categoriaProdutoService.listarCategoriaProduto().subscribe({

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
          this.listaCategoria();
                   
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
       
}
