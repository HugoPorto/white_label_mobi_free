import { createContext, useEffect, useState } from "react";
import { AuthResponse } from '../../domain/models/AuthResponse';
import { LocalStorage } from "../../data/sources/local/LocalStorage";

export interface AuthContextProps {
    authResponse: AuthResponse | null;
    saveAuthSession: (authResponse: AuthResponse) => Promise<void>;
    getAuthSession: () => Promise<void>;
    removeAuthSession: () => Promise<void>;
}

export const AuthContext = createContext( {} as AuthContextProps );

export const AuthProvider = ({children, authUseCases}: any) => {
    const [authResponse, setAuthResponse] = useState<AuthResponse | null>(null);

    useEffect(() => {
        console.log('AuthContext - Inicializando, buscando sessão salva...');
        getAuthSession();
    }, [])
    

    const saveAuthSession = async (authResponse: AuthResponse) => {
        console.log('AuthContext - Salvando sessão:', authResponse.user.email);
        await authUseCases.saveAuthSession.execute(authResponse);
        setAuthResponse(authResponse);
    }

    const getAuthSession = async () => {
        console.log('AuthContext - Buscando sessão salva...');
        const authData = await authUseCases.getAuthSession.execute();
        console.log('AuthContext - Session Data:', authData ? `Usuário: ${authData.user?.email}` : 'Nenhuma sessão encontrada');
        setAuthResponse(authData);
    }

    const removeAuthSession = async () => {
        console.log('AuthContext - Removendo sessão...');
        await authUseCases.removeAuthSession.execute();
        setAuthResponse(null);
        console.log('AuthContext - Sessão removida com sucesso');
    }

    return (
        <AuthContext.Provider value={{
            authResponse,
            saveAuthSession,
            getAuthSession,
            removeAuthSession
        }}>
            {children}
        </AuthContext.Provider>
    )

}