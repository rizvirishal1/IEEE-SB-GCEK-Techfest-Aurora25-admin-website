import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:5001/api/";

const api = axios.create({
    baseURL: baseURL,
});

export default api;
