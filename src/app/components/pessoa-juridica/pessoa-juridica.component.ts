import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PessoaJuridica } from 'src/app/model/pessoa-juridica';
import { LoginService } from 'src/app/services/login.service';
import { PessoaJuridicaService } from 'src/app/services/pessoa-juridica.service';

@Component({
  selector: 'app-pessoa-juridica',
  templateUrl: './pessoa-juridica.component.html',
  styleUrls: ['./pessoa-juridica.component.css'],
})
export class PessoaJuridicaComponent implements OnInit {
  lista = new Array<PessoaJuridica>();
  pjForm: FormGroup;
  pj: PessoaJuridica;
  varPesquisa: String = '';
  qtdPagina: Number = 0;
  arrayNumber: Number[] = [];
  paginaAtual: Number = 0;

  constructor(
    private fb: FormBuilder,
    private pessoaJuridicaService: PessoaJuridicaService,
    private loginService: LoginService
  ) {
    this.pj = new PessoaJuridica();

    this.pjForm = this.fb.group({
      id: [],
      cnpj: [null, Validators.required],
      inscEstadual: [null, Validators.required],
      inscMunicipal: [null, Validators.required],
      nomeFantasia: [null, Validators.required],
      razaoSocial: [null, Validators.required],
      categoria: [null, Validators.required],
      nome: [null, !Validators.required],
      email: [null, !Validators.required],
      telefone: [null, !Validators.required],
      tipoPessoa: [null, !Validators.required],
      empresa: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.pessoaJuridicaService.qtdPaginaPj().subscribe({
      next: (res) => {
        this.qtdPagina = Number(res);

        this.arrayNumber = Array(this.qtdPagina)
          .fill(0)
          .map((x, i) => i);
      },
      error: (error) => {},
    });

    this.listaPj(0);
  }

  atualizaQtdPagina(): void {
    this.pessoaJuridicaService.qtdPaginaPj().subscribe({
      next: (res) => {
        this.qtdPagina = Number(res);

        this.arrayNumber = Array(this.qtdPagina)
          .fill(0)
          .map((x, i) => i);
      },
      error: (error) => {},
    });
  }

  listaPj(pagina: Number) {
    this.pessoaJuridicaService.listaPorPagePj(pagina).subscribe({
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
    this.pjForm = this.fb.group({
      id: [],
      cnpj: [null, Validators.required],
      inscEstadual: [null, Validators.required],
      inscMunicipal: [null, Validators.required],
      nomeFantasia: [null, Validators.required],
      razaoSocial: [null, Validators.required],
      categoria: [null, Validators.required],
      nome: [null, Validators.required],
      email: [null, Validators.required],
      telefone: [null, Validators.required],
      tipoPessoa: [null, Validators.required],
      empresa: [this.loginService.objetoEmpresa(), Validators.required],
    });
  }

  pjObjeto(): PessoaJuridica {
    return {
      id: this.pjForm.get('id')?.value!,
      cnpj: this.pjForm.get('cnpj')?.value!,
      inscEstadual: this.pjForm.get('inscEstadual')?.value!,
      inscMunicipal: this.pjForm.get('inscMunicipal')?.value!,
      nomeFantasia: this.pjForm.get('nomeFantasia')?.value!,
      razaoSocial: this.pjForm.get('razaoSocial')?.value!,
      categoria: this.pjForm.get('categoria')?.value!,
      nome: this.pjForm.get('nome')?.value!,
      telefone: this.pjForm.get('telefone')?.value!,
      tipoPessoa: this.pjForm.get('tipoPessoa')?.value!,
      empresa: this.pjForm.get('empresa')?.value!,
    };
  }

  salvarPj() {
    const acesso = this.pjObjeto();
    this.pessoaJuridicaService.salvarPj(acesso);

    this.novo();
    this.listaPj(this.paginaAtual);
  }

  editarPj(p: PessoaJuridica): void {
    this.pessoaJuridicaService.buscarPjId(p.id).subscribe({
      next: (data) => {
        this.pj = data;
        this.pjForm = this.fb.group({
          id: [this.pj.id],
          npj: [this.pj.cnpj, Validators.required],
          inscEstadual: [this.pj.inscEstadual, Validators.required],
          inscMunicipal: [this.pj.inscMunicipal, Validators.required],
          nomeFantasia: [this.pj.nomeFantasia, Validators.required],
          razaoSocial: [this.pj.razaoSocial, Validators.required],
          categoria: [this.pj.categoria, Validators.required],
          nome: [this.pj.nome, !Validators.required],
          email: [this.pj.email, !Validators.required],
          telefone: [this.pj.telefone, !Validators.required],
          tipoPessoa: [this.pj.tipoPessoa, !Validators.required],
          empresa: [this.loginService.objetoEmpresa(), Validators.required]
        });
      },
      error: (error) => {
        alert(error);
      },
    });
  }

  deletarPj(a: PessoaJuridica): void {
      var confim = confirm('Deseja mesmo deletar');
  
      if (confim) {
        this.pessoaJuridicaService.deletePessoaJuridica(a);
        this.listaPj(this.paginaAtual);
      }
    }

    setPesquisa(val: String): void {
      this.varPesquisa = val;
    }

    pesquisar(): void {

      if(this.varPesquisa.length <= 0){
        this.listaPj(this.paginaAtual);
        return;
      }
     
    this.pessoaJuridicaService.buscarPorNomePj(this.varPesquisa).subscribe({
  
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
      this.listaPj(this.paginaAtual);
    }
    
    voltar() {
      if (this.paginaAtual.valueOf() > 0) {
        this.paginaAtual = this.paginaAtual.valueOf() - 1;
      }
  
      this.listaPj(this.paginaAtual);
    }
  
    avancar() {
      if (this.paginaAtual.valueOf() < this.qtdPagina.valueOf()) {
        this.paginaAtual = this.paginaAtual.valueOf() + 1;
      }
      this.listaPj(this.paginaAtual);
    }
}
