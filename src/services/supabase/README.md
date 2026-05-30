# Supabase services

Nesta fase, as telas públicas principais usam o Supabase para:

- criar ocorrência com upload de foto;
- listar ocorrências;
- abrir detalhe;
- exibir mapa com dados reais;
- enviar confirmação de resolução com foto;
- denunciar ocorrência;
- denunciar resolução.

A área admin agora usa autenticação real com Supabase Auth e checagem na tabela `profiles`.

## Como criar o primeiro admin

1. Acesse Supabase > Authentication > Users.
2. Crie um usuário com e-mail e senha.
3. Copie o ID do usuário criado.
4. Execute `supabase/admin-setup.sql`, trocando o ID e o nome do administrador.

Sem uma linha correspondente na tabela `profiles` com `role = 'admin'`, o login é recusado mesmo que a senha esteja correta.
