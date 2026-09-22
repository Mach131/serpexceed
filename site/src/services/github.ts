import axios from 'axios';
import { API_KEY } from '../env/env';

const GITHUB_API_URL = 'https://api.github.com';

const api = axios.create({ baseURL: GITHUB_API_URL });
api.interceptors.request.use((config) => {
  config.headers.set("Authorization", `Bearer ${API_KEY}`);
  return config;
});

export const getRepoPathContents = async (path: string) => {
  const response = await api.get(`repos/Mach131/serpexceed/contents/${path}`);
  return response.data;
};