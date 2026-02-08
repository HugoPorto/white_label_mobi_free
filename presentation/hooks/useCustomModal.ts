import { useState, useCallback } from 'react';

export interface ModalConfig {
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    buttons?: Array<{
        text: string;
        onPress: () => void;
        style?: 'default' | 'cancel' | 'destructive';
    }>;
}

export const useCustomModal = () => {
    const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const showModal = useCallback((config: ModalConfig) => {
        setModalConfig(config);
        setIsVisible(true);
    }, []);

    const hideModal = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => {
            setModalConfig(null);
        }, 200); // Delay para permitir animação de saída
    }, []);

    // Funções de conveniência para diferentes tipos de modal
    const showSuccess = useCallback((title: string, message: string, onConfirm?: () => void) => {
        showModal({
            title,
            message,
            type: 'success',
            buttons: [
                {
                    text: 'OK',
                    onPress: onConfirm || (() => {}),
                    style: 'default',
                },
            ],
        });
    }, [showModal]);

    const showError = useCallback((title: string, message: string, onConfirm?: () => void) => {
        showModal({
            title,
            message,
            type: 'error',
            buttons: [
                {
                    text: 'OK',
                    onPress: onConfirm || (() => {}),
                    style: 'default',
                },
            ],
        });
    }, [showModal]);

    const showWarning = useCallback((title: string, message: string, onConfirm?: () => void) => {
        showModal({
            title,
            message,
            type: 'warning',
            buttons: [
                {
                    text: 'OK',
                    onPress: onConfirm || (() => {}),
                    style: 'default',
                },
            ],
        });
    }, [showModal]);

    const showConfirmation = useCallback((
        title: string,
        message: string,
        onConfirm: () => void,
        onCancel?: () => void,
        confirmText: string = 'Confirmar',
        cancelText: string = 'Cancelar'
    ) => {
        showModal({
            title,
            message,
            type: 'warning',
            buttons: [
                {
                    text: cancelText,
                    onPress: onCancel || (() => {}),
                    style: 'cancel',
                },
                {
                    text: confirmText,
                    onPress: onConfirm,
                    style: 'destructive',
                },
            ],
        });
    }, [showModal]);

    return {
        modalConfig,
        isVisible,
        showModal,
        hideModal,
        showSuccess,
        showError,
        showWarning,
        showConfirmation,
    };
};
