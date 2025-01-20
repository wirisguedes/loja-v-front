import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Endereco } from 'src/app/model/endereco';
import { PessoaJuridica } from 'src/app/model/pessoa-juridica';
import { EnderecoService } from 'src/app/services/endereco.service';
import { LoginService } from 'src/app/services/login.service';
import { PessoaJuridicaService } from 'src/app/services/pessoa-juridica.service';

@Component({
  selector: 'app-pessoa-juridica',
  templateUrl: './pessoa-juridica.component.html',
  styleUrls: ['./pessoa-juridica.component.css'],
})
export class PessoaJuridicaComponent implements OnInit {
  lista = new Array<PessoaJuridica>();
  enderecos = new Array<Endereco>();
  pjForm: FormGroup;
  endForm: FormGroup;
  pj: PessoaJuridica;
  varPesquisa: String = '';
  qtdPagina: Number = 0;
  arrayNumber: Number[] = [];
  paginaAtual: Number = 0;

  constructor(
    private fb: FormBuilder,
    private pessoaJuridicaService: PessoaJuridicaService,
    private loginService: LoginService,
    private enderecoServie: EnderecoService
  ) {
    this.pj = new PessoaJuridica();

    this.pjForm = this.fb.group({
      id: [],
      cnpj: [null, Validators.required],
      inscEstadual: [null, Validators.required],
      inscMunicipal: [null, Validators.required],
      nomeFantasia: [null, Validators.required],
      razaoSocial: [null, Validators.required],
      categoria: ['', Validators.required],
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
    this.enderecos = new Array<Endereco>();
    this.pjForm = this.fb.group({
      id: [],
      cnpj: [null, Validators.required],
      inscEstadual: [null, Validators.required],
      inscMunicipal: [null, Validators.required],
      nomeFantasia: [null, Validators.required],
      razaoSocial: [null, Validators.required],
      categoria: ['', Validators.required],
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
      email: this.pjForm.get('email')?.value!,
      telefone: this.pjForm.get('telefone')?.value!,
      tipoPessoa: this.pjForm.get('tipoPessoa')?.value!,
      enderecos: this.enderecos,
      empresa: this.pjForm.get('empresa')?.value!
    }
  }

  addEndereco(){
    const end = this.enderecoObjeto();    

     if (end.id != null && end.id != undefined){
        for(var i = 0; i< this.enderecos.length; i++){
            var e = this.enderecos[i];
            if(e.cep === end.cep && e.id != end.id){
              return;
            }
        }
     }
      
     var index = this.enderecos.map(e => e.cep).indexOf(end.cep);
     var indexId = this.enderecos.map(e => e.id).indexOf(end.id);
  

     if (index < 0 && indexId < 0) {
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

  salvarPj() {
    const pj = this.pjObjeto();
    this.pessoaJuridicaService.salvarPj2(pj, this);

    this.listaPj(this.paginaAtual);
  }

  editarPj(p: PessoaJuridica): void {
    this.pessoaJuridicaService.buscarPjId(p.id).subscribe({
      next: (data) => {
        this.pj = data;

        this.enderecos = this.pj.enderecos !== undefined ? this.pj.enderecos : new Array<Endereco>();

        this.pjForm = this.fb.group({
          id: [this.pj.id],
          cnpj: [this.pj.cnpj, Validators.required],
          inscEstadual: [this.pj.inscEstadual, Validators.required],
          inscMunicipal: [this.pj.inscMunicipal, Validators.required],
          nomeFantasia: [this.pj.nomeFantasia, Validators.required],
          razaoSocial: [this.pj.razaoSocial, Validators.required],
          categoria: [this.pj.categoria, Validators.required],
          nome: [this.pj.nome, !Validators.required],
          email: [this.pj.email, !Validators.required],
          telefone: [this.pj.telefone, !Validators.required],
          tipoPessoa: [this.pj.tipoPessoa, !Validators.required],
          enderecos: [this.enderecos, !Validators.required],
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
