import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Acesso } from 'src/app/model/acesso';

import { LoginService } from 'src/app/services/login.service';
import { AcessoService } from 'src/app/services/acesso.service';

@Component({
  selector: 'app-acesso',
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.css'],
})
export class AcessoComponent implements OnInit {
  lista = new Array<Acesso>();
  acessoForm: FormGroup;
  acesso: Acesso;
  varPesquisa: String = '';
  qtdPagina: Number = 0;
  arrayNumber: Number[] = [];
  paginaAtual: Number = 0;

  constructor(
    private fb: FormBuilder,
    private acessoService: AcessoService,
    private loginService: LoginService
  ) {
    this.acesso = new Acesso();

    /* Obter dados do form, inicia e limpa*/
    this.acessoForm = this.fb.group({
      id: [],
      descricao: [null, Validators.required],
      empresa: [this.loginService.objetoEmpresa(), Validators.required],
    });
  }

  /*Executa no momento que a tela abre*/
  ngOnInit(): void {
    this.acessoService.qtdPaginaAcesso().subscribe({
      next: (res) => {
        this.qtdPagina = Number(res);

        this.arrayNumber = Array(this.qtdPagina)
          .fill(0)
          .map((x, i) => i);
      },
      error: (error) => {},
    });

    this.listaAcesso(0);
  }

  atualizaQtdPagina(): void {
    this.acessoService.qtdPaginaAcesso().subscribe({
      next: (res) => {
        this.qtdPagina = Number(res);

        this.arrayNumber = Array(this.qtdPagina)
          .fill(0)
          .map((x, i) => i);
      },
      error: (error) => {},
    });
  }

  novo(): void {
    this.acessoForm = this.fb.group({
      id: [],
      descricao: [null, Validators.required],
      empresa: [this.loginService.objetoEmpresa(), Validators.required],
    });
  }

  listaAcesso(pagina: Number) {
    this.acessoService.listarAcesso(pagina).subscribe({
      next: (res) => {
        this.atualizaQtdPagina();
        this.lista = res;
      },
      error: (error) => {
        alert(error);
      },
    });
  }

  acessoObjeto(): Acesso {
    return {
      id: this.acessoForm.get('id')?.value!,
      descricao: this.acessoForm.get('descricao')?.value!,
      empresa: this.acessoForm.get('empresa')?.value!,
    };
  }
  
  salvarAcesso() {
    const acesso = this.acessoObjeto();
    this.acessoService.salvarAcesso(acesso);

    this.novo();
    this.listaAcesso(this.paginaAtual);
  }

  editarAcesso(a: Acesso): void {
    this.acessoService.buscarAcessoPorId(a.id).subscribe({
      next: (data) => {
        this.acesso = data;
        this.acessoForm = this.fb.group({
          id: [this.acesso.id],
          descricao: [this.acesso.descricao, Validators.required],
          empresa: [this.acesso.empresa, Validators.required],
        });
      },
      error: (error) => {
        alert(error);
      },
    });
  }

  deletarAcesso(a: Acesso): void {
    var confim = confirm('Deseja mesmo deletar');

    if (confim) {
      this.acessoService.deletaAcesso(a);
      this.listaAcesso(this.paginaAtual);
    }
  }

  setPesquisa(val: String): void {
    this.varPesquisa = val;
  }

  pesquisar(): void {
    if (this.varPesquisa.length <= 0) {
      this.listaAcesso(this.paginaAtual);
      return;
    }

    this.acessoService.buscarAcessoPorDesc(this.varPesquisa).subscribe({
      next: (res) => {
        this.lista = res;
      },
      error: (error) => {
        alert(error);
      },
    });
  }

  buscarPagina(p: Number): void {
    this.paginaAtual = p;
    this.listaAcesso(this.paginaAtual);
  }

  voltar() {
    if (this.paginaAtual.valueOf() > 0) {
      this.paginaAtual = this.paginaAtual.valueOf() - 1;
    }

    this.listaAcesso(this.paginaAtual);
  }

  avancar() {
    if (this.paginaAtual.valueOf() < this.qtdPagina.valueOf()) {
      this.paginaAtual = this.paginaAtual.valueOf() + 1;
    }
    this.listaAcesso(this.paginaAtual);
  }
}
