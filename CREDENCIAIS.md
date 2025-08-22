# 🔐 Guia de Configuração de Credenciais

Este documento explica como configurar as credenciais necessárias para executar o projeto IA Brisa 2.0.

## ⚠️ AVISO IMPORTANTE

**NUNCA commite arquivos de credenciais no Git!** 
- Os arquivos de credenciais estão no `.gitignore`
- Use os arquivos de exemplo como base
- Mantenha suas credenciais seguras e privadas

## 📋 Lista de Credenciais Necessárias

### 1. Google Cloud Service Account (Backend)
**Arquivo:** `server-iabrisa/functions/src/config/firebase/credential/account.json`

**Como obter:**
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione seu projeto
3. Vá para "IAM & Admin" > "Service Accounts"
4. Clique em "Create Service Account"
5. Dê um nome (ex: "firebase-functions")
6. Adicione as seguintes roles:
   - Firebase Admin
   - Cloud Functions Developer
   - Service Account User
7. Clique em "Create and Continue"
8. Clique em "Done"
9. Na lista de contas de serviço, clique na que você criou
10. Vá para a aba "Keys"
11. Clique em "Add Key" > "Create new key"
12. Selecione "JSON" e clique em "Create"
13. O arquivo será baixado automaticamente

**Estrutura do arquivo:**
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

### 2. Configuração Firebase (Backend)
**Arquivo:** `server-iabrisa/functions/src/config/firebase/credential/config.json`

**Como obter:**
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá para "Project Settings" (ícone de engrenagem)
4. Na aba "General", role para baixo
5. Em "Your apps", clique em "Add app" > "Web"
6. Dê um nome (ex: "server-config")
7. Clique em "Register app"
8. Copie as configurações

**Estrutura do arquivo:**
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

### 3. Configuração Firebase (Frontend - App)
**Arquivo:** `app-iabrisa/src/config/firebase.js`

**Como obter:**
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá para "Project Settings" > "General"
4. Em "Your apps", clique em "Add app" > "Web"
5. Dê um nome (ex: "app-iabrisa")
6. Clique em "Register app"
7. Copie as configurações

**Estrutura do arquivo:**
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

### 4. Configuração Firebase (Frontend - Panel)
**Arquivo:** `panel-iabrisa/src/config/firebase.js`

**Como obter:**
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá para "Project Settings" > "General"
4. Em "Your apps", clique em "Add app" > "Web"
5. Dê um nome (ex: "panel-iabrisa")
6. Clique em "Register app"
7. Copie as configurações

**Estrutura do arquivo:**
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

## 🚀 Passo a Passo para Configurar

### 1. Clone o Repositório
```bash
git clone https://github.com/jhonattadhayek/appiabrisanovo.git
cd appiabrisanovo
```

### 2. Copie os Arquivos de Exemplo
```bash
# Backend
cp server-iabrisa/functions/src/config/firebase/credential/account.example.json server-iabrisa/functions/src/config/firebase/credential/account.json
cp server-iabrisa/functions/src/config/firebase/credential/config.example.json server-iabrisa/functions/src/config/firebase/credential/config.json

# Frontend - App
cp app-iabrisa/env.example app-iabrisa/.env

# Frontend - Panel
cp panel-iabrisa/env.example panel-iabrisa/.env

# Backend
cp server-iabrisa/functions/env.example server-iabrisa/functions/.env
```

### 3. Preencha as Credenciais
Edite cada arquivo copiado e substitua os valores de exemplo pelas suas credenciais reais.

### 4. Verifique as Permissões
Certifique-se de que os arquivos de credenciais têm as permissões corretas:
```bash
chmod 600 server-iabrisa/functions/src/config/firebase/credential/account.json
chmod 600 server-iabrisa/functions/src/config/firebase/credential/config.json
```

## 🔒 Boas Práticas de Segurança

1. **Nunca commite credenciais** - Use `.gitignore`
2. **Use variáveis de ambiente** - Para configurações sensíveis
3. **Diferentes projetos** - Use projetos separados para dev/prod
4. **Permissões mínimas** - Dê apenas as permissões necessárias
5. **Rotação de chaves** - Troque as credenciais periodicamente
6. **Monitoramento** - Monitore o uso das credenciais

## 🆘 Solução de Problemas

### Erro: "Could not load the default credentials"
- Verifique se o arquivo `account.json` existe
- Confirme se o caminho no `.env` está correto
- Verifique se as permissões do arquivo estão corretas

### Erro: "Firebase: Error (auth/invalid-api-key)"
- Verifique se a API key está correta
- Confirme se o projeto está ativo
- Verifique se as APIs necessárias estão habilitadas

### Erro: "Permission denied"
- Verifique se a conta de serviço tem as permissões corretas
- Confirme se o projeto está ativo no Google Cloud
- Verifique se as APIs estão habilitadas

## 📞 Suporte

Se você encontrar problemas:
1. Verifique se todas as credenciais estão configuradas
2. Confirme se os arquivos estão nos locais corretos
3. Verifique se as permissões estão corretas
4. Abra uma issue no repositório com detalhes do erro

---

**Lembre-se: Segurança em primeiro lugar! Nunca compartilhe suas credenciais.**
