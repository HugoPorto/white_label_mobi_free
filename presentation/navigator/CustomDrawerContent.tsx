import React, { useState, useRef, useEffect } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, Animated, ScrollView } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

export function CustomDrawerContent(props: any) {
    const { authResponse } = useAuth();
    const user = authResponse?.user;
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const scrollViewRef = useRef<any>(null);
    const [containerHeight, setContainerHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        // Verifica se deve mostrar o indicador quando as dimensões mudam
        if (containerHeight > 0 && contentHeight > 0) {
            const hasScroll = contentHeight > containerHeight;
            setShowScrollIndicator(hasScroll && !isAtBottom);
        }
    }, [containerHeight, contentHeight, isAtBottom]);

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={{ flex: 1, paddingTop: 0 }}
            style={{ backgroundColor: '#ffffff' }}
        >
            {/* Header com gradiente */}
            <View style={styles.header}>
                <View style={styles.headerGradient}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={user?.image ? { uri: user.image } : require('../../assets/user_image.png')}
                            style={styles.avatar}
                        />
                        {/* <View style={styles.onlineIndicator} /> */}
                    </View>
                    <Text style={styles.name}>{user?.name || 'Usuário'}</Text>
                    <Text style={styles.email}>{user?.email || ''}</Text>
                    {/* <View style={styles.userBadge}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.badgeText}>Premium</Text>
                    </View> */}
                </View>
            </View>

            {/* Divisor */}
            <View style={styles.divider} />

            {/* Menu Items */}
            <View 
                style={{ flex: 1, position: 'relative' }}
                onLayout={(event) => {
                    setContainerHeight(event.nativeEvent.layout.height);
                }}
            >
                <DrawerContentScrollView 
                    {...props}
                    ref={scrollViewRef}
                    contentContainerStyle={{ paddingTop: 0, paddingBottom: 20 }}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    onScroll={(event) => {
                        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                        const hasScroll = contentSize.height > layoutMeasurement.height;
                        const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
                        setIsAtBottom(isBottom);
                        setContainerHeight(layoutMeasurement.height);
                        setContentHeight(contentSize.height);
                    }}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        setContentHeight(contentHeight);
                    }}
                    scrollEventThrottle={16}
                >
                    <DrawerItemList {...props} />
                </DrawerContentScrollView>

                {/* Indicador de scroll (fade + seta) */}
                {showScrollIndicator && !isAtBottom && (
                    <View style={styles.scrollIndicatorContainer}>
                        <View style={styles.scrollFade} />
                        <View style={styles.scrollArrow}>
                            <Ionicons name="chevron-down" size={20} color="#4CAF50" />
                            <Text style={styles.scrollText}>Mais abaixo</Text>
                        </View>
                    </View>
                )}
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#4CAF50',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        marginBottom: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8
    },
    headerGradient: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#ffffff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5,
        textAlign: 'center',
    },
    email: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 10,
        textAlign: 'center',
    },
    userBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 15,
        marginTop: 5,
    },
    badgeText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 5,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginHorizontal: 20,
        marginBottom: 10,
    },
    menuContainer: {
        flex: 1,
        paddingTop: 8,
        backgroundColor: 'transparent',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        backgroundColor: 'rgba(76, 175, 80, 0.05)',
    },
    appInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    appName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4CAF50',
        marginLeft: 8,
    },
    version: {
        fontSize: 12,
        color: '#666666',
        fontStyle: 'italic',
    },
    scrollIndicatorContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        pointerEvents: 'none',
    },
    scrollFade: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: 'transparent',
        opacity: 0.95,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 0,
    },
    scrollArrow: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollText: {
        fontSize: 11,
        color: '#4CAF50',
        fontWeight: '600',
        marginTop: 2,
    },
});
