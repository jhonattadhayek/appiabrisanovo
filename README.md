# IA Brisa 2.0

Sistema completo de plataforma de apostas com aplicação principal, painel administrativo e servidor backend.

## 🏗️ Estrutura do Projeto

```
IA Brisa 2.0/
├── app-iabrisa/          # Aplicação principal (React)
├── panel-iabrisa/        # Painel administrativo (React)
└── server-iabrisa/       # Servidor backend (Firebase Functions)
```

## 🚀 Como Configurar o Projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Firebase
- Conta no Google Cloud Platform

### 1. Clone o Repositório

```bash
git clone https://github.com/jhonattadhayek/appiabrisanovo.git
cd appiabrisanovo
```

### 2. Instale as Dependências

```bash
# Aplicação principal
cd app-iabrisa
npm install

# Painel administrativo
cd ../panel-iabrisa
npm install

# Servidor backend
cd ../server-iabrisa/functions
npm install
```

### 3. 🔐 Configuração das Credenciais

**⚠️ IMPORTANTE: Nunca commite arquivos de credenciais no Git!**

#### Para o Servidor (server-iabrisa)

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Firebase
4. Vá para "IAM & Admin" > "Service Accounts"
5. Crie uma nova conta de serviço ou use uma existente
6. Baixe o arquivo JSON de credenciais

**Localização das credenciais:**
```
server-iabrisa/functions/src/config/firebase/credential/
├── account.json     # Credenciais da conta de serviço (NÃO COMMITAR!)
└── config.json      # Configuração do Firebase (NÃO COMMITAR!)
```

**Arquivo de exemplo para account.json:**
```json
{
  "type": "service_account",
  "project_id": "seu-projeto-id",
  "private_key_id": "sua-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "sua-conta@seu-projeto.iam.gserviceaccount.com",
  "client_id": "seu-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/sua-conta%40seu-projeto.iam.gserviceaccount.com"
}
```

**Arquivo de exemplo para config.json:**
```json
{
  "apiKey": "sua-api-key",
  "authDomain": "seu-projeto.firebaseapp.com",
  "projectId": "seu-projeto",
  "storageBucket": "seu-projeto.appspot.com",
  "messagingSenderId": "seu-messaging-sender-id",
  "appId": "seu-app-id"
}
```

#### Para as Aplicações Frontend (app-iabrisa e panel-iabrisa)

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá para "Project Settings" > "General"
4. Role para baixo até "Your apps"
5. Clique em "Add app" e selecione "Web"
6. Copie as configurações

**Localização das configurações:**
```
app-iabrisa/src/config/firebase.js
panel-iabrisa/src/config/firebase.js
```

**Exemplo de configuração:**
```javascript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "seu-messaging-sender-id",
  appId: "seu-app-id"
};
```

### 4. Variáveis de Ambiente

Crie arquivos `.env` em cada diretório (não commite estes arquivos):

**app-iabrisa/.env:**
```env
REACT_APP_FIREBASE_API_KEY=sua-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu-projeto
REACT_APP_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=seu-app-id
```

**panel-iabrisa/.env:**
```env
REACT_APP_FIREBASE_API_KEY=sua-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu-projeto
REACT_APP_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=seu-app-id
```

**server-iabrisa/functions/.env:**
```env
GOOGLE_APPLICATION_CREDENTIALS=./src/config/firebase/credential/account.json
FIREBASE_PROJECT_ID=seu-projeto
```

### 5. Executar o Projeto

#### Aplicação Principal
```bash
cd app-iabrisa
npm start
```

#### Painel Administrativo
```bash
cd panel-iabrisa
npm start
```

#### Servidor Backend
```bash
cd server-iabrisa/functions
npm run serve
```

## 🔒 Segurança

- **NUNCA** commite arquivos de credenciais
- Use variáveis de ambiente para configurações sensíveis
- Mantenha as credenciais do Google Cloud seguras
- Use diferentes projetos Firebase para desenvolvimento e produção

## 📁 Arquivos Ignorados pelo Git

O `.gitignore` está configurado para excluir:
- `node_modules/`
- Arquivos `.env`
- Credenciais em `**/credential/`
- Arquivos de build
- Logs e arquivos temporários

## 🆘 Solução de Problemas

### Erro de Credenciais
Se você receber erro de credenciais:
1. Verifique se os arquivos de credenciais existem
2. Confirme se as permissões estão corretas
3. Verifique se o projeto está ativo no Google Cloud

### Erro de Firebase
Se o Firebase não conectar:
1. Verifique se as configurações estão corretas
2. Confirme se o projeto está ativo
3. Verifique se as APIs necessárias estão habilitadas

## 📞 Suporte

Para dúvidas sobre configuração ou problemas técnicos, abra uma issue no repositório.

---

**Lembre-se: Segurança em primeiro lugar! Nunca compartilhe suas credenciais.**
