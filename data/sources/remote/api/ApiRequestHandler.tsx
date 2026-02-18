import axios from "axios";
import { LocalStorage } from "../../local/LocalStorage";
import { AuthResponse } from "../../../../domain/models/AuthResponse";

export const BASE_URL = 'http://xxx.168.xx.x:3000';

const ApiRequestHandler = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const GoogleApiRequestHandler = axios.create({
    baseURL: "https://maps.googleapis.com/maps/api",
    headers: {
        'Content-Type': 'application/json'
    }
});

ApiRequestHandler.interceptors.request.use(
    async(config) => {
        const data = await new LocalStorage().getItem('auth');
        if (data) {
            const authResponse: AuthResponse = JSON.parse(data);
            config.headers['Authorization'] = authResponse.token;
        }
        return config;
    }
)

export { ApiRequestHandler, GoogleApiRequestHandler }