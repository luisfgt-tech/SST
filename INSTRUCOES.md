# Plano Anual de Segurança - PWA

Sistema de gerenciamento do Plano Anual de Segurança desenvolvido como Progressive Web App (PWA).

## Funcionalidades

### 1. Autenticação
- Sistema de login e cadastro de usuários
- Autenticação segura via Supabase
- Sessão persistente

### 2. Gestão de Regionais
- Cadastro, edição e exclusão de regionais
- Interface simples e intuitiva

### 3. Gestão de Responsáveis
- Cadastro de responsáveis vinculados a regionais
- Relacionamento dinâmico: ao selecionar uma regional, apenas os responsáveis daquela regional são listados
- Edição e exclusão de responsáveis

### 4. Plano Anual
- Cadastro completo de ações com:
  - Regional e Responsável (com dependência)
  - Ação, Descrição e Objetivo
  - Prazo de início e fim
  - Status (Planejado, Em andamento, Concluído, Atrasado)
  - Observações
- Filtros por Regional, Responsável e Status
- Edição e exclusão de ações
- Visualização em tabela responsiva

### 5. Dashboard de Indicadores
- Total de ações cadastradas
- Quantidade e percentual por status
- Taxa de conclusão
- Taxa de atraso
- Gráficos visuais

### 6. Recursos PWA
- Instalável em dispositivos móveis e desktop
- Funciona offline (dados em cache)
- Indicador de status de conexão
- Design responsivo para todos os tamanhos de tela

## Como Usar

### Primeiro Acesso
1. Acesse o sistema
2. Clique em "Não tem uma conta? Cadastre-se"
3. Crie sua conta com email e senha
4. Faça login

### Configuração Inicial
1. Acesse "Regionais" no menu lateral
2. Cadastre as regionais da sua organização
3. Acesse "Responsáveis"
4. Cadastre os responsáveis vinculando cada um a uma regional

### Uso do Plano Anual
1. Acesse "Plano Anual" no menu
2. Clique em "Nova Ação"
3. Preencha o formulário:
   - Selecione a Regional
   - Selecione o Responsável (apenas da regional escolhida)
   - Preencha os dados da ação
   - Defina prazos e status
4. Salve a ação

### Filtros
1. Clique em "Filtros" na tela do Plano Anual
2. Selecione Regional, Responsável ou Status
3. A tabela será filtrada automaticamente
4. Use "Limpar filtros" para remover os filtros

### Dashboard
1. Acesse "Indicadores" no menu
2. Visualize estatísticas gerais do plano
3. Acompanhe o progresso das ações

## Instalação como PWA

### Android
1. Abra o site no Chrome
2. Toque no menu (três pontos)
3. Selecione "Adicionar à tela inicial"
4. Confirme

### iOS
1. Abra o site no Safari
2. Toque no ícone de compartilhar
3. Selecione "Adicionar à Tela de Início"
4. Confirme

### Desktop (Chrome/Edge)
1. Acesse o site
2. Clique no ícone de instalação na barra de endereço
3. Confirme a instalação

## Modo Offline

O sistema funciona offline através de cache local. Quando offline:
- Você pode visualizar dados já carregados
- Um aviso será exibido indicando que você está offline
- Algumas funcionalidades podem estar limitadas
- Ao voltar online, os dados serão sincronizados automaticamente

## Suporte

O sistema é compatível com:
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Dispositivos móveis (Android e iOS)
- Tablets
- Desktop

## Observações Importantes

- Apenas usuários autenticados podem acessar o sistema
- Cada usuário só pode editar/excluir seus próprios registros
- Mas todos podem visualizar todos os registros
- Faça logout ao finalizar para maior segurança
- Mantenha sua senha segura
