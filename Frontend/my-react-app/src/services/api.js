//src/services/api.js
import axios from "axios";


  const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;

const API = axios.create({
  baseURL: apiUrl,
});

export default API;