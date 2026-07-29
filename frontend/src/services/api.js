import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor for setting the Authorization header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor for handling global errors (e.g., 401 Unauthorized)
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('access_token');
        window.dispatchEvent(new Event('auth-change'));
        // We can't safely use useNavigate here because it's outside React Router context,
        // but removing the token and dispatching the event triggers the AuthContext update.
    }
    return Promise.reject(error);
});

export default api;
