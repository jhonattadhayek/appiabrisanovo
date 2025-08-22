import { ClientSdk, SsidAuthMethod } from '@quadcode-tech/client-sdk-js';
import useAuth from 'hooks/useAuth';

const PLATAFORM = 'avalonbroker'; // astronbroker
const SOCKET = `wss://ws.trade.${PLATAFORM}.com/echo/websocket`;

let sdkInstance = null;

async function initialize(ssid) {
  try {
    await fetch(`https://api.trade.${PLATAFORM}.com/v1/logout`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include'
    }).catch(() => console.log('/v1/logout'));

    sdkInstance = await ClientSdk.create(SOCKET, 481, new SsidAuthMethod(ssid));
    console.log('✅ SDK conectado com sucesso!');

    return sdkInstance;
  } catch (error) {
    useAuth().logout();
    console.error('❌ Erro ao inicializar o SDK:', error);
    throw error;
  }
}

async function getSdk() {
  return sdkInstance;
}

export default { initialize, getSdk };
