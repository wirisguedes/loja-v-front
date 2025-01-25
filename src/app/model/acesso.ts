import { PessoaJuridica } from "./pessoa-juridica";

export class Acesso {
    constructor(){}

    id?: number;
    descricao?: String;
    empresa?: PessoaJuridica;
    possuiAcesso?: Boolean;
}
