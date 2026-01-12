/*
  # Plano Anual de Segurança - Schema

  ## Description
  Creates the complete database schema for the Annual Security Plan PWA application,
  replacing Excel spreadsheets with a robust relational database system.

  ## New Tables
  
  ### 1. `regionais`
  Regional offices/units table
    - `id` (uuid, primary key) - Unique identifier
    - `nome_regional` (text) - Regional name
    - `created_at` (timestamptz) - Creation timestamp
    - `created_by` (uuid) - User who created the record
  
  ### 2. `responsaveis`
  Responsible persons table with regional dependency
    - `id` (uuid, primary key) - Unique identifier
    - `nome_responsavel` (text) - Responsible person's name
    - `regional_id` (uuid, foreign key) - Links to regionais table
    - `created_at` (timestamptz) - Creation timestamp
    - `created_by` (uuid) - User who created the record
  
  ### 3. `plano_anual`
  Annual plan records table
    - `id` (uuid, primary key) - Unique identifier
    - `regional_id` (uuid, foreign key) - Links to regionais table
    - `responsavel_id` (uuid, foreign key) - Links to responsaveis table
    - `acao` (text) - Action/activity name
    - `descricao` (text) - Detailed description
    - `objetivo` (text) - Objective/goal
    - `prazo_inicio` (date) - Start date
    - `prazo_fim` (date) - End date
    - `status` (text) - Status (Planejado, Em andamento, Concluído, Atrasado)
    - `observacoes` (text) - Notes/observations
    - `data_atualizacao` (timestamptz) - Last update timestamp
    - `created_at` (timestamptz) - Creation timestamp
    - `created_by` (uuid) - User who created the record

  ## Security
  
  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Authenticated users can read all records
  - Authenticated users can insert records (marked with their user ID)
  - Users can update and delete their own records
  
  ## Indexes
  - Foreign key indexes for performance
  - Status index for filtering
  - Date indexes for range queries

  ## Important Notes
  1. The `responsaveis` table has a foreign key to `regionais`, enforcing the dependency
  2. The `plano_anual` table references both `regionais` and `responsaveis`
  3. All timestamps use `timestamptz` for timezone awareness
  4. Status values are stored as text for flexibility
  5. All tables track who created records for audit purposes
*/

-- Create regionais table
CREATE TABLE IF NOT EXISTS regionais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_regional text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create responsaveis table with regional dependency
CREATE TABLE IF NOT EXISTS responsaveis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_responsavel text NOT NULL,
  regional_id uuid NOT NULL REFERENCES regionais(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create plano_anual table
CREATE TABLE IF NOT EXISTS plano_anual (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  regional_id uuid NOT NULL REFERENCES regionais(id) ON DELETE CASCADE,
  responsavel_id uuid NOT NULL REFERENCES responsaveis(id) ON DELETE CASCADE,
  acao text NOT NULL,
  descricao text,
  objetivo text,
  prazo_inicio date NOT NULL,
  prazo_fim date NOT NULL,
  status text NOT NULL DEFAULT 'Planejado',
  observacoes text,
  data_atualizacao timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_responsaveis_regional ON responsaveis(regional_id);
CREATE INDEX IF NOT EXISTS idx_plano_anual_regional ON plano_anual(regional_id);
CREATE INDEX IF NOT EXISTS idx_plano_anual_responsavel ON plano_anual(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_plano_anual_status ON plano_anual(status);
CREATE INDEX IF NOT EXISTS idx_plano_anual_prazo_fim ON plano_anual(prazo_fim);

-- Enable Row Level Security
ALTER TABLE regionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsaveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE plano_anual ENABLE ROW LEVEL SECURITY;

-- RLS Policies for regionais
CREATE POLICY "Users can view all regionais"
  ON regionais FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert regionais"
  ON regionais FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own regionais"
  ON regionais FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own regionais"
  ON regionais FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- RLS Policies for responsaveis
CREATE POLICY "Users can view all responsaveis"
  ON responsaveis FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert responsaveis"
  ON responsaveis FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own responsaveis"
  ON responsaveis FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own responsaveis"
  ON responsaveis FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- RLS Policies for plano_anual
CREATE POLICY "Users can view all plano_anual"
  ON plano_anual FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert plano_anual"
  ON plano_anual FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own plano_anual"
  ON plano_anual FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own plano_anual"
  ON plano_anual FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);