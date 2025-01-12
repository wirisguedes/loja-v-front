import { PessoaJuridica } from "./pessoa-juridica";

export class Pessoa {

    constructor(){
        
    }

    id?: Number;
    nome?: String;
    email?: String;
    telefone?: String;
    tipoPessoa?: String;
    empresa?: PessoaJuridica;

}
