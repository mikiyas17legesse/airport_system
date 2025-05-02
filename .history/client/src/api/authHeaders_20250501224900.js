import axios from 'axios';
import { getToken } from '../context/AuthContext';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

