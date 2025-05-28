import axios from 'axios';

export const login = async (email: string, password: string): Promise<string> => {
  try {
    const response = await axios.post('http://localhost:5254/user/Auth/login', null, {
        params: {
          email,
          password
        }
      });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || 'Erreur de connexion';
  }
};
