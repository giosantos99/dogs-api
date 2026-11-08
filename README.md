# 🐶 Dogs API — API REST com Node.js e MongoDB

API REST desenvolvida com Node.js, Express e MongoDB para fornecer os recursos de uma rede social para cachorros.

O projeto foi criado para substituir a API utilizada originalmente no projeto Dogs do curso de React da Origamid, permitindo desenvolver e integrar um backend próprio.

## 🚀 Sobre o Projeto

A Dogs API é responsável pelo gerenciamento de usuários, autenticação, publicações, comentários e estatísticas da aplicação Dogs.

A API utiliza MongoDB Atlas para persistência dos dados, autenticação com JSON Web Token (JWT) e integração SMTP para recuperação de senhas.

O desenvolvimento teve como objetivo praticar arquitetura de APIs REST, organização em camadas, autenticação, validação de dados e segurança no backend.

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JavaScript (ES Modules)
- JSON Web Token (JWT)
- bcryptjs
- Multer
- Nodemailer
- express-rate-limit
- file-type
- dotenv
- CORS

## ✨ Funcionalidades

### Usuários e autenticação

- Cadastro de usuários
- Login com JWT
- Validação de tokens
- Proteção de rotas autenticadas
- Criptografia de senhas com bcrypt
- Validação de senhas
- Recuperação de senha por e-mail
- Redefinição de senha com token temporário
- Invalidação de sessões antigas após redefinição de senha

### Publicações

- Upload de fotos
- Validação de tipo e tamanho dos arquivos
- Listagem de publicações
- Paginação do feed
- Busca de publicações por usuário
- Visualização individual de fotos
- Contagem de acessos
- Exclusão de publicações pelo autor

### Interações e estatísticas

- Comentários em publicações
- Consulta de comentários
- Estatísticas de visualizações por usuário

### Segurança

- Autenticação JWT
- Controle de acesso às rotas protegidas
- Hash de senhas com bcrypt
- Hash SHA-256 dos tokens de recuperação
- Expiração e utilização única dos tokens de recuperação
- Invalidação de JWTs após redefinição de senha
- Rate limiting nas rotas de autenticação e recuperação de senha
- Validação de arquivos enviados
- Configuração de CORS
- Limites de tamanho para requisições JSON
- Tratamento centralizado de erros

## 📂 Estrutura do Projeto

```text
dogs-api/
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   └── utils/
├── app.js
├── server.js
├── package.json
├── .env.example
└── README.md
```

- **controllers:** lógica das requisições e respostas.
- **middlewares:** autenticação, upload, rate limiting e tratamento de erros.
- **models:** modelos de dados do MongoDB.
- **routes:** definição dos endpoints.
- **services:** serviços auxiliares, como envio de e-mails.
- **uploads:** armazenamento local de imagens no ambiente de desenvolvimento.
- **utils:** funções reutilizáveis e validações.

## 🔗 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/jwt-auth/v1/token` | Realizar login |
| POST | `/jwt-auth/v1/token/validate` | Validar JWT |

### Usuários

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/user` | Cadastrar usuário |
| GET | `/api/user` | Consultar usuário autenticado |

### Recuperação de senha

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/password/lost` | Solicitar recuperação |
| POST | `/api/password/reset` | Redefinir senha |

### Publicações

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/photo` | Listar fotos |
| GET | `/api/photo/:id` | Consultar foto |
| POST | `/api/photo` | Publicar foto |
| DELETE | `/api/photo/:id` | Excluir foto |

### Comentários e estatísticas

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/comment/:id` | Adicionar comentário |
| GET | `/api/stats` | Consultar estatísticas |

Alguns endpoints exigem autenticação via Bearer Token.

## ⚙️ Como Executar o Projeto

### Pré-requisitos

- Node.js
- npm
- Banco de dados MongoDB
- Serviço SMTP para recuperação de senhas

### Instalação

Clone o repositório:

```bash
git clone https://github.com/giosantos99/dogs-api
```

Acesse a pasta:

```bash
cd dogs-api
```

Instale as dependências:

```bash
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, utilizando as seguintes variáveis:

```dotenv
PORT=3000
MONGO_URI=sua_string_de_conexao_mongodb
JWT_SECRET=seu_segredo_jwt
SMTP_HOST=servidor_smtp
SMTP_PORT=587
SMTP_USER=seu_usuario_smtp
SMTP_PASS=sua_senha_smtp
FRONTEND_URL=http://localhost:5173
```

Utilize valores próprios e seguros para cada ambiente.

**Importante:** nunca publique o arquivo `.env` com credenciais reais no GitHub.

### Executar em desenvolvimento

```bash
npm run dev
```

A API estará disponível em:

```text
http://localhost:3000
```

Para verificar o funcionamento:

```http
GET http://localhost:3000/
```

Resposta esperada:

```json
{
  "message": "Dogs API funcionando!"
}
```

## 🔐 Autenticação

A API utiliza JWT para autenticar usuários.

Após realizar o login, o cliente recebe um token que deve ser enviado nas requisições protegidas:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

Os tokens possuem prazo de expiração e podem ser invalidados após a redefinição da senha por meio do controle de versão armazenado no usuário.

## 📤 Upload de Imagens

O upload é realizado utilizando Multer.

Os arquivos passam por verificações de tamanho, tipo MIME e assinatura do arquivo.

Formatos aceitos:

- JPEG
- PNG
- WebP

Tamanho máximo: **5 MB por arquivo**.

No desenvolvimento local, as imagens são armazenadas no diretório `src/uploads`.

Para ambientes de produção com sistema de arquivos temporário, é necessário utilizar armazenamento persistente.

## 🛡️ Segurança

A aplicação implementa medidas de proteção como autenticação JWT, hash de senhas, validação de entradas, controle de acesso e limitação de requisições.

Os tokens de recuperação de senha são armazenados como hashes e possuem expiração de 30 minutos.

As rotas de autenticação e recuperação utilizam rate limiting para reduzir tentativas automatizadas e solicitações excessivas.

## 🔗 Frontend

Este backend foi desenvolvido para integração com o projeto Dogs em React.

**Repositório frontend:** [Dogs App](https://github.com/giosantos99/dogs).

**API online:** [Adicionar link após o deploy]

## 📚 Créditos

API desenvolvida como projeto de estudo independente para integração com o frontend Dogs, baseado no curso de React da [Origamid](https://www.origamid.com/).

## 👩‍💻 Autoria

Desenvolvido por Giovanna Santos de Souza.

Projeto para fins de estudo e portfólio.
