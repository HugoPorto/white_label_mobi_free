// Exemplo de como usar o UserRoleContext em qualquer componente

import React from 'react';
import { View, Text, Button } from 'react-native';
import { useUserRole, useIsClient, useIsDriver } from '../context/UserRoleContext';

export default function ExampleComponent() {
    const { userRole, setUserRole, clearUserRole, isLoading } = useUserRole();
    const isClient = useIsClient();
    const isDriver = useIsDriver();

    if (isLoading) {
        return (
            <View>
                <Text>Carregando papel do usuário...</Text>
            </View>
        );
    }

    return (
        <View style={{ padding: 20 }}>
            <Text>Papel atual: {userRole || 'Nenhum'}</Text>
            <Text>É Cliente: {isClient ? 'Sim' : 'Não'}</Text>
            <Text>É Motorista: {isDriver ? 'Sim' : 'Não'}</Text>
            
            <Button 
                title="Definir como Cliente" 
                onPress={() => setUserRole('CLIENT')} 
            />
            
            <Button 
                title="Definir como Motorista" 
                onPress={() => setUserRole('DRIVER')} 
            />
            
            <Button 
                title="Limpar Papel" 
                onPress={clearUserRole} 
            />
        </View>
    );
}

/*
COMO USAR EM QUALQUER PÁGINA:

1. Importar os hooks:
import { useUserRole, useIsClient, useIsDriver } from '../../context/UserRoleContext';

2. No componente:
const { userRole, setUserRole } = useUserRole();
const isClient = useIsClient();
const isDriver = useIsDriver();

3. Usar nos condicionais:
if (isClient) {
    // Lógica específica para cliente
}

if (isDriver) {
    // Lógica específica para motorista
}

4. Alterar o papel:
await setUserRole('CLIENT'); // ou 'DRIVER'

5. Limpar o papel:
await clearUserRole();
*/
