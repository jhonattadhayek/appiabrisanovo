import axios from 'axios';

const env = () => (window.location.hostname === 'localhost' ? '_DEV' : '_PROD');

const Api = axios.create({ baseURL: process.env[`REACT_APP_API${env()}`] });

const message = 'Houve uma falha inesperada.';
const callback = response => (response && response.data) || message;

Api.interceptors.response.use(
  response => response,
  error => Promise.reject(callback(error.response))
);

export default Api;
