# 🐶 Dogs API — API REST com Node.js e MongoDB

API REST desenvolvida com **Node.js, Express e MongoDB**, responsável pelas funcionalidades de uma rede social para compartilhamento de fotos de cachorros.

O projeto foi criado para substituir a API utilizada originalmente no projeto Dogs do curso de React da Origamid, permitindo desenvolver e integrar um backend próprio.

### 🌐 Projeto Online

- **Frontend:** [Dogs Social](https://app-dogs-social.vercel.app/)
- **API:** [Dogs API](https://dogs-api-bn0r.onrender.com/)
- **Repositório do frontend:** [Dogs — React](https://github.com/giosantos99/dogs)

---

## 🚀 Sobre o Projeto

A Dogs API é responsável pelo gerenciamento de usuários, autenticação, publicações, comentários e estatísticas da aplicação Dogs.

O backend utiliza **MongoDB Atlas** para persistência de dados, **JWT** para autenticação, **Cloudinary** para armazenamento de imagens e **Resend** para envio de e-mails de recuperação de senha.

A aplicação está hospedada na **Render** e integrada ao frontend React publicado na **Vercel**.

O desenvolvimento teve como objetivo praticar arquitetura de APIs REST, organização em camadas, autenticação, validação de dados, integração com serviços externos, segurança e deploy de aplicações Node.js.

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- JavaScript (ES Modules)
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

### Upload e armazenamento
- Multer
- Cloudinary
- file-type

### Segurança e configurações
- express-rate-limit
- dotenv
- CORS
- Node.js Crypto

### Serviços e hospedagem
- Resend — envio de e-mails
- Render — hospedagem da API
- Vercel — hospedagem do frontend

## ✨ Funcionalidades

### Usuários e autenticação

- Cadastro de usuários
- Login com JWT
- Validação de tokens
- Proteção de rotas autenticadas
- Hash de senhas com bcrypt
- Validação de força de senha
- Recuperação de senha por e-mail
- Redefinição de senha com token temporário
- Invalidação de sessões antigas após redefinição de senha

### Publicações

- Upload de fotos para o Cloudinary
- Validação de tipo e tamanho dos arquivos
- Listagem de publicações
- Paginação do feed
- Busca de publicações por usuário
- Visualização individual de fotos
- Contagem de acessos
- Exclusão de publicações pelo autor
- Exclusão de imagens armazenadas no Cloudinary

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
- Rate limiting nas rotas de autenticação e recuperação
- Validação de arquivos enviados
- Configuração de CORS
- Limites de tamanho para requisições JSON
- Tratamento centralizado de erros
- Credenciais armazenadas em variáveis de ambiente

## 📂 Estrutura do Projeto

```text
dogs-api/
├── src/
│   ├── config/
│   │   └── cloudinary.js
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
├── package-lock.json
├── .env.example
└── README.md
```

**Descrição dos diretórios:**

- **config:** configurações de serviços externos, como Cloudinary.
- **controllers:** lógica das requisições e respostas.
- **middlewares:** autenticação, upload, rate limiting e tratamento de erros.
- **models:** modelos de dados do MongoDB.
- **routes:** definição dos endpoints.
- **services:** serviços auxiliares, como envio de e-mails.
- **uploads:** compatibilidade com imagens locais antigas.
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

- Node.js e npm
- Banco de dados MongoDB Atlas
- Conta no Cloudinary
- Conta no Resend

### Instalação

Clone o repositório:

```bash
git clone https://github.com/giosantos99/dogs-api.git
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

Crie um arquivo `.env` na raiz do projeto, utilizando `.env.example` como referência:

```dotenv
PORT=3000

MONGO_URI=sua_string_de_conexao_mongodb
JWT_SECRET=seu_segredo_jwt

FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

RESEND_API_KEY=sua_chave_resend
RESEND_FROM_EMAIL=seu_remetente_autorizado
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

A API utiliza JSON Web Token (JWT) para autenticar usuários.

Após realizar o login, o cliente recebe um token que deve ser enviado nas requisições protegidas:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

Os tokens possuem prazo de expiração e podem ser invalidados após a redefinição da senha por meio do controle de versão armazenado no usuário.

### Recuperação de senha

A recuperação de senha utiliza o Resend para envio de e-mails por API HTTPS.

O processo envolve:

1. Solicitação de recuperação pelo usuário.
2. Geração de um token temporário.
3. Armazenamento do hash SHA-256 do token no MongoDB.
4. Envio do link de recuperação por e-mail.
5. Validação do token e redefinição da senha.
6. Invalidação das sessões anteriores.

Os tokens de recuperação possuem validade de **30 minutos** e são de utilização única.

**Observação:** para permitir o envio de e-mails a qualquer usuário em produção, é necessário configurar um domínio de envio verificado no Resend. O remetente de testes possui restrições de destinatário.

## 📤 Upload de Imagens

O upload utiliza **Multer** para receber as imagens em memória e **Cloudinary** para armazenamento na nuvem.

Antes do envio, os arquivos passam por verificações de tamanho, tipo MIME e assinatura do arquivo.

**Formatos aceitos:**
- JPEG
- PNG
- WebP

**Tamanho máximo:** 5 MB por arquivo.

### Fluxo de armazenamento

1. O usuário seleciona uma imagem no frontend.
2. O Multer recebe o arquivo em memória.
3. O backend valida o formato e o tamanho.
4. A imagem é enviada ao Cloudinary.
5. A URL HTTPS e o identificador público da imagem são armazenados no MongoDB.
6. O frontend utiliza a URL do Cloudinary para exibir a foto.

Ao excluir uma publicação, a API também solicita a exclusão da imagem correspondente no Cloudinary.

A aplicação mantém compatibilidade com registros de imagens locais antigas, embora os arquivos locais não sejam persistidos na hospedagem gratuita.

na hospedagem gratuita.

🛡️ Segurança

A aplicação implementa medidas de proteção como autenticação JWT, hash de senhas, validação de entradas, controle de acesso e limitação de requisições.

As rotas de autenticação e recuperação de senha utilizam rate limiting para reduzir tentativas automatizadas e solicitações excessivas.

O backend também utiliza CORS para restringir as origens autorizadas a acessar a API pelo navegador.

As credenciais de MongoDB, JWT, Cloudinary e Resend são armazenadas em variáveis de ambiente.

## ☁️ Deploy e Hospedagem

A aplicação utiliza a seguinte arquitetura:

| Serviço | Responsabilidade |
| --- | --- |
| Vercel | Hospedagem do frontend ReactVercel |
| Render | Hospedagem da API Node.jRenders |
| MongoDB Atlas | Persistência dos dados |
| Cloudinary | Armazenamento das imagens |
| Resend | Envio de e-mails |

**Backend — Render**

URL: https://dogs-api-bn0r.onrender.com/

Configuração utilizada:

Build Command: npm ci
Start Command: npm start
Branch: main

As credenciais e configurações de produção são cadastradas como variáveis de ambiente na Render.

**Observação:** no plano gratuito da Render, a instância pode entrar em repouso após um período de inatividade. A primeira requisição após esse período pode apresentar um tempo de resposta maior.

Frontend — Vercel
```bash
URL: https://app-dogs-social.vercel.app/
```

O frontend utiliza a variável:
```bash
VITE_API_URL=https://dogs-api-bn0r.onrender.com
```

No backend, o domínio autorizado é configurado por:
```bash
FRONTEND_URL=https://app-dogs-social.vercel.app
```
## 🔗 Frontend

Este backend foi desenvolvido para integração com o projeto Dogs em React.

Aplicação online: Dogs Social

Repositório frontend: Dogs — React

## 📚 Créditos

API desenvolvida como projeto de estudo independente para integração com o frontend Dogs, baseado no curso de React da Origamid.

O frontend tem como base o projeto apresentado no curso, enquanto o backend foi desenvolvido separadamente para reproduzir e ampliar a experiência de integração com uma API própria.

## 👩‍💻 Autoria

Desenvolvido por Giovanna Santos de Souza.

Projeto para fins de estudo e portfólio.