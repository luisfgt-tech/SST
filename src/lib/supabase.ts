import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      regionais: {
        Row: {
          id: string;
          nome_regional: string;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          nome_regional: string;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          nome_regional?: string;
          created_at?: string;
          created_by?: string | null;
        };
      };
      responsaveis: {
        Row: {
          id: string;
          nome_responsavel: string;
          regional_id: string;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          nome_responsavel: string;
          regional_id: string;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          nome_responsavel?: string;
          regional_id?: string;
          created_at?: string;
          created_by?: string | null;
        };
      };
      plano_anual: {
        Row: {
          id: string;
          regional_id: string;
          responsavel_id: string;
          acao: string;
          descricao: string | null;
          objetivo: string | null;
          prazo_inicio: string;
          prazo_fim: string;
          status: string;
          observacoes: string | null;
          data_atualizacao: string;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          regional_id: string;
          responsavel_id: string;
          acao: string;
          descricao?: string | null;
          objetivo?: string | null;
          prazo_inicio: string;
          prazo_fim: string;
          status?: string;
          observacoes?: string | null;
          data_atualizacao?: string;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          regional_id?: string;
          responsavel_id?: string;
          acao?: string;
          descricao?: string | null;
          objetivo?: string | null;
          prazo_inicio?: string;
          prazo_fim?: string;
          status?: string;
          observacoes?: string | null;
          data_atualizacao?: string;
          created_at?: string;
          created_by?: string | null;
        };
      };
    };
  };
};
