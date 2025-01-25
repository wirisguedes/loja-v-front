import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Acesso } from 'src/app/model/acesso';
import { UserPessoa } from 'src/app/model/user-pessoa';

import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AcessoComponent } from '../acesso/acesso.component';
import { AcessoService } from 'src/app/services/acesso.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit{

  lista = new Array<UserPessoa>();
  acesso = new Array<Acesso>();
  usuarioFormGroup: FormGroup;
  user: UserPessoa;
  
  constructor(
      private fb: FormBuilder,     
      private loginService: LoginService,
      private usuarioService: UsuarioService,
      private acessoService: AcessoService
     
    ) {
     
      this.user = new UserPessoa();
      this.usuarioFormGroup = this.fb.group({
        id:[],
        login:[null, Validators.required],
        senha:[null, Validators.required],
        pessoa:[null, Validators.required],
        empresa: [this.loginService.objetoEmpresa(), Validators.required]
      });
    }

    ngOnInit(): void {
      this.listUser();
    }

    listUser(){
      this.usuarioService.listUserByEmpresa().subscribe({
        next: (res) => {
          this.lista = res;
        },
        error: (error) => {
          alert(error);
        }
      });
    }

    novo(): void{
      this.usuarioFormGroup = this.fb.group({
        id:[],
        login:[null, Validators.required],
        senha:[null, Validators.required],
        pessoa:[null, Validators.required],
        empresa: [this.loginService.objetoEmpresa(), Validators.required]
      });
    }

    usuarioObjeto(): UserPessoa{
      return{
        id: this.usuarioFormGroup.get('id')?.value!,
        login: this.usuarioFormGroup.get('login')?.value!,
        senha: this.usuarioFormGroup.get('senha')?.value!
      }
    }

    editarUsuario(id: any): void{

      this.usuarioService.buscarUsuarioId(id).subscribe({
        next: (data) => {
          this.user = data;

          this.usuarioFormGroup = this.fb.group({
            id:[this.user.id],
            login:[this.user.login],
            senha:[this.user.senha],
            pessoa:[this.user.pessoa?.nome]
      
          });
          this.acessoService.listarAcessoTodos().subscribe({
            next: (data) => {
              this.acesso = data;

              this.acesso.forEach((ab) => {

                this.user.acessos?.forEach((au) => {
                  if(ab.id == au.id){
                    ab.possuiAcesso = true;
                  }
                });
              });

            }

          });
        },
        error: (error) =>{
          alert(error);
        }
      })

      
    }

    salvarUser(): void{
      this.user = this.usuarioObjeto();
      this.usuarioService.salvarUserPessoa(this.user);
    }

    adicionarRemoverAcesso(a: Acesso): void{

      console.info(a.id);
      this.usuarioService.adicionarRemoverAcesso(a.id, this.user.id);
    }

    removerUserPessoa(idUser: any) {
      var idUserLogado = localStorage.getItem('idUser'); /**Obter id usuário logado */

      if (idUserLogado == idUser){
        alert('Não é possivel excluir próprio registro');
        return false;
      }
      this.usuarioService.removerUserPessoa(idUser);
      this.listUser();
      return true;
    }
}
