import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Usuario } from './model/usuario';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  titulologin = 'Login da Loja';

  constructor(private fb: FormBuilder, private loginService: LoginService){

  }

  /*obter dados do formulário*/
  loginForm = this.fb.group({
    id:[],
    login: [null, Validators.required],
    senha:[null, Validators.required]
  });

  /*Transforma em objeto */
  loginObjeto(): Usuario{
    return {
      login: this.loginForm.get('login')?.value!,
      senha: this.loginForm.get('senha')?.value!
    }
  }

  realizarLogin(){
    const usuario = this.loginObjeto();

    this.loginService.logar(usuario);

    console.info('dados de login ' + usuario.login)
    console.info('dados de login ' + usuario.senha)
  }

  recuperarSenha(){
    const usuario = this.loginObjeto();

    var login = usuario.login;

    if(login == ''){
      alert('Informe o login para recuperar senha!')
    }else{
      this.loginService.recuperarSenha(login);
    }
  }
}
