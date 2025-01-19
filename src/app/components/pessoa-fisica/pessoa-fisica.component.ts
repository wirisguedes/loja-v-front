import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PessoaFisica } from 'src/app/model/pessoa-fisica';

import { LoginService } from 'src/app/services/login.service';
import { PessoaFisicaService } from 'src/app/services/pessoa-Fisica.service';


@Component({
  selector: 'app-pessoa-fisica',
  templateUrl: './pessoa-fisica.component.html',
  styleUrls: ['./pessoa-fisica.component.css'],
})
export class PessoaFisicaComponent implements OnInit {
  lista = new Array<PessoaFisica>();
  pfForm: FormGroup;
  pf: PessoaFisica;
  varPesquisa: String = '';
  qtdPagina: Number = 0;
  arrayNumber: Number[] = [];
  paginaAtual: Number = 0;

  constructor(
    private fb: FormBuilder,
    private pessoaFisicaService: PessoaFisicaService,
    private loginService: LoginService
  ) {
    this.pf = new PessoaFisica();

    this.pfForm = this.fb.group({
      id: [],
      cpf: [null, !Validators.required],
      dataNascimento: [null, !Validators.required],   
      nome: [null, !Validators.required],
      email: [null, !Validators.required],
      telefone: [null, !Validators.required],
      tipoPessoa: ['', !Validators.required],
      empresa: [this.loginService.objetoEmpresa(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.pessoaFisicaService.qtdPaginaPf().subscribe({
      next: (res) => {
        this.qtdPagina = Number(res);

        this.arrayNumber = Array(this.qtdPagina)
          .fill(0)
          .map((x, i) => i);
      },
      error: (error) => {},
    });

    this.listaPf(0);
  }

  atualizaQtdPagina(): void {
    this.pessoaFisicaService.qtdPaginaPf().subscribe({
      next: (res) => {
        this.qtdPagina = Number(res);

        this.arrayNumber = Array(this.qtdPagina)
          .fill(0)
          .map((x, i) => i);
      },
      error: (error) => {},
    });
  }

  listaPf(pagina: Number) {
    this.pessoaFisicaService.listaPorPagePf(pagina).subscribe({
      next: (res) => {
        this.atualizaQtdPagina();
        this.lista = res;
      },
      error: (error) => {
        alert(error);
      },
    });
  }

  novo(): void {
    this.pfForm = this.fb.group({
      id: [],
      cpf: [null, !Validators.required],
      dataNascimento: [null, !Validators.required],  
      nome: [null, !Validators.required],
      email: [null, !Validators.required],
      telefone: [null, !Validators.required],
      tipoPessoa: ['', !Validators.required],
      empresa: [this.loginService.objetoEmpresa(), Validators.required]
    });
  }

  pfObjeto(): PessoaFisica {
    return {
      id: this.pfForm.get('id')?.value!,      
      cpf: this.pfForm.get('cpf')?.value!,
      dataNascimento: this.pfForm.get('dataNascimento')?.value!,
      nome: this.pfForm.get('nome')?.value!,
      email: this.pfForm.get('email')?.value!,
      telefone: this.pfForm.get('telefone')?.value!,
      tipoPessoa: this.pfForm.get('tipoPessoa')?.value!,
      empresa: this.pfForm.get('empresa')?.value!
    }
  }

  salvarPf() {
    const acesso = this.pfObjeto();
    this.pessoaFisicaService.salvarPf(acesso);

    this.novo();
    this.listaPf(this.paginaAtual);
  }

  editarPf(p: PessoaFisica): void {
    this.pessoaFisicaService.buscarPfId(p.id).subscribe({
      next: (data) => {
        this.pf = data;
        this.pfForm = this.fb.group({
          id: [this.pf.id],         
          cpf: [this.pf.cpf, !Validators.required],
          dataNascimento: [this.pf.dataNascimento, !Validators.required],
          nome: [this.pf.nome, !Validators.required],
          email: [this.pf.email, !Validators.required],
          telefone: [this.pf.telefone, !Validators.required],
          tipoPessoa: [this.pf.tipoPessoa, !Validators.required],
          empresa: [this.loginService.objetoEmpresa(), Validators.required]
        });
      },
      error: (error) => {
        alert(error);
      },
    });
  }

  deletarPf(a: PessoaFisica): void {
      var confim = confirm('Deseja mesmo deletar');
  
      if (confim) {
        this.pessoaFisicaService.deletePessoaFisica(a);
        this.listaPf(this.paginaAtual);
      }
    }

    setPesquisa(val: String): void {
      this.varPesquisa = val;
    }

    pesquisar(): void {

      if(this.varPesquisa.length <= 0){
        this.listaPf(this.paginaAtual);
        return;
      }
     
    this.pessoaFisicaService.buscarPorNomePf(this.varPesquisa).subscribe({
  
      next: (res) =>{
          this.lista = res;
      },
      error: (error) => {
         alert(error);
      }
  
    });
  
    }

    buscarPagina(p: Number): void {
      this.paginaAtual = p;
      this.listaPf(this.paginaAtual);
    }
    
    voltar() {
      if (this.paginaAtual.valueOf() > 0) {
        this.paginaAtual = this.paginaAtual.valueOf() - 1;
      }
  
      this.listaPf(this.paginaAtual);
    }
  
    avancar() {
      if (this.paginaAtual.valueOf() < this.qtdPagina.valueOf()) {
        this.paginaAtual = this.paginaAtual.valueOf() + 1;
      }
      this.listaPf(this.paginaAtual);
    }
}
