import axios from 'axios';

export const fetchPackages = async () => {
  const { data } = await axios.get('/packages', { withCredentials: true });
  return data;
};

export const createPackage = async (packageData) => {
  const { data } = await axios.post('/packages', packageData, { withCredentials: true });
  return data;
};
