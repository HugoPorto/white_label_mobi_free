import React from "react";
import {
    FlatList,
    View,
    Text,
    StatusBar,
    SafeAreaView,
    RefreshControl
} from "react-native";
import { container } from "../../../di/container";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { DocsItem } from "./DocsItem";
import { DocumentsViewModel } from "./DocumentsViewModel";
import { DocumentResponse } from "../../../domain/models/DocumentResponse";
import { Ionicons } from '@expo/vector-icons';
import styles from './Styles';

export function DocsScreen() {
    const documentsViewModel = new DocumentsViewModel();
    const { authResponse } = useAuth();
    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            handleGetDocumentsByUser();
        }, [authResponse])
    );

    const handleGetDocumentsByUser = async () => {
        if (authResponse !== null) {
            setLoading(true);
            try {
                const response = await documentsViewModel.getUserDocuments(authResponse.user.id!, authResponse.session_id, true);
                
                if ('statusCode' in response) {
                    console.error('Erro ao buscar documentos:', response);
                    setDocuments([]);
                } else {
                    setDocuments(response);
                }
            } catch (error) {
                console.error('Erro ao buscar documentos:', error);
                setDocuments([]);
            } finally {
                setLoading(false);
            }
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await handleGetDocumentsByUser();
        setRefreshing(false);
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Ionicons name="document-text-outline" size={64} color="#9E9E9E" />
            </View>
            <Text style={styles.emptyTitle}>Nenhum documento cadastrado</Text>
            <Text style={styles.emptySubtitle}>
                Envie seus documentos para começar a realizar corridas
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

            <View style={styles.contentContainer}>
                <FlatList
                    data={documents}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <DocsItem document={item} onRefresh={handleGetDocumentsByUser} />
                    )}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmpty}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#2196F3']}
                            tintColor="#2196F3"
                        />
                    }
                />
            </View>
            <View style={styles.bottomSpacer} />
        </SafeAreaView>
    );
}