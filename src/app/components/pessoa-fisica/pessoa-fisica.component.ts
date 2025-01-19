import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Endereco } from 'src/app/model/endereco';
import { PessoaFisica } from 'src/app/model/pessoa-fisica';
import { EnderecoService } from 'src/app/services/endereco.service';

import { LoginService } from 'src/app/services/login.service';
import { PessoaFisicaService } from 'src/app/services/pessoa-Fisica.service';


@Component({
  selector: 'app-pessoa-fisica',
  templateUrl: './pessoa-fisica.component.html',
  styleUrls: ['./pessoa-fisica.component.css'],
})
export class PessoaFisicaComponent implements OnInit {
  lista = new Array<PessoaFisica>();
  enderecos = new Array<Endereco>();
  pfForm: FormGroup;
  endForm: FormGroup;
  pf: PessoaFisica;
  varPesquisa: String = '';
  qtdPagina: Number = 0;
  arrayNumber: Number[] = [];
  paginaAtual: Number = 0;

  constructor(
    private fb: FormBuilder,
    private pessoaFisicaService: PessoaFisicaService,
    private loginService: LoginService,
    private enderecoServie: EnderecoService
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
      enderecos: [this.enderecos, !Validators.required],
      empresa: [this.loginService.objetoEmpresa(), Validators.required]
    });

    this.endForm = this.fb.group({
      id:['', !Validators.required],
      ruaLogra: [null, Validators.required],
      cep: [null, Validators.required],
      numero: [null, Validators.required],
      complemento: [null, Validators.required],
      bairro: [null, Validators.required],
      uf: [null, Validators.required],
      cidade: [null, Validators.required],
      estado: [null, Validators.required],
      tipoEndereco: ['', Validators.required]

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
    this.enderecos = new Array<Endereco>();
    this.pfForm = this.fb.group({
      id: [],
      cpf: [null, !Validators.required],
      dataNascimento: [null, !Validators.required],  
      nome: [null, !Validators.required],
      email: [null, !Validators.required],
      telefone: [null, !Validators.required],
      tipoPessoa: ['', !Validators.required],
      enderecos: [this.enderecos, !Validators.required],
      empresa: [this.loginService.objetoEmpresa(), Validators.required]
    });

    this.endForm = this.fb.group({
      id:['', !Validators.required],
      ruaLogra: [null, Validators.required],
      cep: [null, Validators.required],
      numero: [null, Validators.required],
      complemento: [null, Validators.required],
      bairro: [null, Validators.required],
      uf: [null, Validators.required],
      cidade: [null, Validators.required],
      estado: [null, Validators.required],
      tipoEndereco: ['', Validators.required]

    });
  }

  enderecoObjeto(): Endereco {
    return{
      id: this.endForm.get("id")?.value,
      ruaLogra: this.endForm.get("ruaLogra")?.value,
      cep: this.endForm.get("cep")?.value,
      numero: this.endForm.get("numero")?.value,
      complemento: this.endForm.get("complemento")?.value,
      bairro: this.endForm.get("bairro")?.value,
      uf: this.endForm.get("uf")?.value,
      cidade: this.endForm.get("cidade")?.value,
      estado: this.endForm.get("estado")?.value,
      tipoEndereco: this.endForm.get("tipoEndereco")?.value      

    }
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
      enderecos: this.enderecos,
      empresa: this.pfForm.get('empresa')?.value!
    }
  }

  addEndereco(){
    const end = this.enderecoObjeto();

    var index = this.enderecos.map(e => e.cep).indexOf(end.cep);

    if(index < 0){
      this.enderecos.push(end);
    }else{
      this.enderecos.splice(index,1);
      this.enderecos.push(end);
    }
  }

  excluirEndereco(e: Endereco): void{
    var index = this.enderecos.map(e => e.cep).indexOf(e.cep);
    this.enderecoServie.excluirEndereco(e);
    this.enderecos.splice(index,1);
  }

  exibirEndereco(e: Endereco): void{

    this.endForm = this.fb.group({
      id:[e.id, !Validators.required],
      ruaLogra: [e.ruaLogra, Validators.required],
      cep: [e.cep, Validators.required],
      numero: [e.numero, Validators.required],
      complemento: [e.complemento, Validators.required],
      bairro: [e.bairro, Validators.required],
      uf: [e.uf, Validators.required],
      cidade: [e.cidade, Validators.required],
      estado: [e.estado, Validators.required],
      tipoEndereco: [e.tipoEndereco, Validators.required]
    });
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
        this.enderecos = this.pf.enderecos !== undefined ? this.pf.enderecos : new Array<Endereco>();
        this.pfForm = this.fb.group({
          id: [this.pf.id],         
          cpf: [this.pf.cpf, !Validators.required],
          dataNascimento: [this.pf.dataNascimento, !Validators.required],
          nome: [this.pf.nome, !Validators.required],
          email: [this.pf.email, !Validators.required],
          telefone: [this.pf.telefone, !Validators.required],
          tipoPessoa: [this.pf.tipoPessoa, !Validators.required],
          enderecos: [this.enderecos, !Validators.required],
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
