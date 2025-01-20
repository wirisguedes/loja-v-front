import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Usuario } from 'src/app/model/usuario';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit{

  lista = new Array<Usuario>();
  usuarioFormGroup: FormGroup;
  
  constructor(
      private fb: FormBuilder,     
      private loginService: LoginService,
      private usuarioService: UsuarioService
     
    ) {
     
      this.usuarioFormGroup = this.fb.group({
        id:[]
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
        id:[]
      });
    }

    usuarioObjeto(): Usuario{
      return{
        id: this.usuarioFormGroup.get('id')?.value!,
        login: this.usuarioFormGroup.get('id')?.value!,
        senha: this.usuarioFormGroup.get('id')?.value!
      }
    }

    editarUsuario(u: Usuario): void{
      this.usuarioFormGroup = this.fb.group({
      
      });
    }
}
