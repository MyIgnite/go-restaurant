import axios from 'axios';

const api = axios.create({
  baseURL: 'https://my-json-server.typicode.com/MyIgnite/go-restaurant',
});

export default api;
