import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

@Injectable()
export class ExternalApiService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Busca dados de endereço na API ViaCEP
   * @param cep CEP para buscar (formato: 00000-000 ou 00000000)
   * @returns Dados do endereço da API ViaCEP
   */
  async searchCEP(cep: string): Promise<ViaCepResponse> {
    try {
      // Remove caracteres não numéricos do CEP
      const cleanCep = cep.replace(/\D/g, '');
      
      if (cleanCep.length !== 8) {
        throw new NotFoundException(`CEP inválido: ${cep}`);
      }

      const response = await firstValueFrom(
        this.httpService.get<ViaCepResponse>(`https://viacep.com.br/ws/${cleanCep}/json/`)
      );

      if (response.data.erro) {
        throw new NotFoundException(`CEP ${cep} não encontrado`);
      }

      return response.data;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Erro ao buscar CEP ${cep}: ${error.message}`);
    }
  }
}
