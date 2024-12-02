import axios from 'axios';
import config from '../config';

export default axios.create({
  baseURL: config.API_ROOT,
  timeout: 60000,
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'B1S-CaseInsensitive': true,
  },
  transformResponse: data => {
    // console.log("fetch response", data);
    return data;
  },
  withCredentials: true,
});
