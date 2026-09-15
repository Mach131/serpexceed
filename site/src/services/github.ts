import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';

export const getRepoDirectoryContents = async (path: string) => {
  const response = await axios.get(`${GITHUB_API_URL}/repos/Mach131/serpexceed/contents/${path}`);
  return response.data;
};