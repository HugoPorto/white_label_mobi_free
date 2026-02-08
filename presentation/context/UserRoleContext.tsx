import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'CLIENT' | 'DRIVER' | null;

interface UserRoleContextType {
    userRole: UserRole;
    setUserRole: (role: UserRole) => Promise<void>;
    isLoading: boolean;
    clearUserRole: () => Promise<void>;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

const USER_ROLE_STORAGE_KEY = '@user_role';

interface UserRoleProviderProps {
    children: ReactNode;
}

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({ children }) => {
    const [userRole, setUserRoleState] = useState<UserRole>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Carregar o papel do usuário do AsyncStorage na inicialização
    useEffect(() => {
        loadUserRole();
    }, []);

    const loadUserRole = async () => {
        try {
            setIsLoading(true);
            const storedRole = await AsyncStorage.getItem(USER_ROLE_STORAGE_KEY);
            if (storedRole && (storedRole === 'CLIENT' || storedRole === 'DRIVER')) {
                setUserRoleState(storedRole as UserRole);
                console.log('📱 Papel do usuário carregado:', storedRole);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar papel do usuário:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setUserRole = async (role: UserRole) => {
        try {
            if (role) {
                await AsyncStorage.setItem(USER_ROLE_STORAGE_KEY, role);
                console.log('✅ Papel do usuário salvo:', role);
            } else {
                await AsyncStorage.removeItem(USER_ROLE_STORAGE_KEY);
                console.log('🗑️ Papel do usuário removido');
            }
            setUserRoleState(role);
        } catch (error) {
            console.error('❌ Erro ao salvar papel do usuário:', error);
            throw error;
        }
    };

    const clearUserRole = async () => {
        await setUserRole(null);
    };

    const value: UserRoleContextType = {
        userRole,
        setUserRole,
        isLoading,
        clearUserRole,
    };

    return (
        <UserRoleContext.Provider value={value}>
            {children}
        </UserRoleContext.Provider>
    );
};

// Hook personalizado para usar o contexto
export const useUserRole = (): UserRoleContextType => {
    const context = useContext(UserRoleContext);
    if (context === undefined) {
        throw new Error('useUserRole deve ser usado dentro de um UserRoleProvider');
    }
    return context;
};

// Hook para verificar se é cliente
export const useIsClient = (): boolean => {
    const { userRole } = useUserRole();
    return userRole === 'CLIENT';
};

// Hook para verificar se é motorista
export const useIsDriver = (): boolean => {
    const { userRole } = useUserRole();
    return userRole === 'DRIVER';
};
