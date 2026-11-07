# Documento de Requisitos e Permissões

## 1. Contexto
A CTRL PLAY está expandindo e precisa de uma plataforma segura para gerenciar alunos, mantendo o acompanhamento acadêmico e pedagógico centralizado.

## 2. Objetivo
Criar uma ferramenta web que permita:
- registrar alunos;
- listar todos os alunos em um carômetro;
- editar dados;
- excluir cadastros;
- registrar feedbacks dos professores.

## 3. Requisitos funcionais
- Cadastrar novos alunos com foto, nome completo, idade, turma e ano/semestre de entrada.
- Exibir os alunos em carômetro.
- Permitir edição de dados do aluno.
- Permitir exclusão do cadastro.
- Permitir o registro de feedbacks de professores.

## 4. Requisito de segurança e permissão
O acesso à plataforma deve ser restrito a usuários autorizados da CTRL PLAY, como professores e equipe escolar.

### Regra aplicada
- Professor: autorizado
- Equipe: autorizado
- Visitante: bloqueado

Essa regra é defendida para evitar vazamento de informações sensíveis e garantir que apenas usuários autorizados tenham permissão para alterar dados acadêmicos.

## 5. Estratégia de implementação recomendada em produção
Para implantação real, recomenda-se:
- autenticação com NextAuth, Auth0 ou Supabase Auth;
- controle de sessões por role;
- restrição de rotas e ações por perfil;
- filas/validação para impedir acessos indevidos;
- banco de dados com políticas de segurança (RLS no Supabase, por exemplo).

## 6. Conclusão
A solução proposta equilibra funcionalidade e segurança. O sistema atende ao desafio de gestão dos alunos e também aplica o princípio de acesso controlado, respeitando o uso exclusivo por usuários autorizados da CTRL PLAY.
