import axios, {AxiosInstance} from "axios";

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'X-User-ID': localStorage.getItem('userId') ?? '',
    },
});

