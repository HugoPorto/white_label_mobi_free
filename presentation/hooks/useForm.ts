import { useState, useCallback } from 'react';

export interface FieldValidation {
    isValid: boolean;
    message: string;
}

export interface FormField {
    value: string;
    validation: FieldValidation;
}

export interface UseFormReturn<T> {
    fields: Record<keyof T, FormField>;
    updateField: (fieldName: keyof T, value: string, validation?: FieldValidation) => void;
    validateField: (fieldName: keyof T, validationFn: (value: string) => FieldValidation) => void;
    isFormValid: () => boolean;
    getFieldValues: () => Record<keyof T, string>;
    resetForm: () => void;
}

export function useForm<T extends Record<string, any>>(initialValues: T): UseFormReturn<T> {
    const [fields, setFields] = useState<Record<keyof T, FormField>>(() => {
        const initialFields = {} as Record<keyof T, FormField>;
        Object.keys(initialValues).forEach(key => {
            initialFields[key as keyof T] = {
                value: initialValues[key] || '',
                validation: { isValid: true, message: '' }
            };
        });
        return initialFields;
    });

    const updateField = useCallback((fieldName: keyof T, value: string, validation?: FieldValidation) => {
        setFields(prev => ({
            ...prev,
            [fieldName]: {
                value,
                validation: validation || prev[fieldName].validation
            }
        }));
    }, []);

    const validateField = useCallback((fieldName: keyof T, validationFn: (value: string) => FieldValidation) => {
        setFields(prev => {
            const currentValue = prev[fieldName].value;
            const validation = validationFn(currentValue);
            return {
                ...prev,
                [fieldName]: {
                    value: currentValue,
                    validation
                }
            };
        });
    }, []);

    const isFormValid = useCallback(() => {
        return Object.values(fields).every(field => field.validation.isValid);
    }, [fields]);

    const getFieldValues = useCallback(() => {
        const values = {} as Record<keyof T, string>;
        Object.keys(fields).forEach(key => {
            values[key as keyof T] = fields[key as keyof T].value;
        });
        return values;
    }, [fields]);

    const resetForm = useCallback(() => {
        setFields(() => {
            const resetFields = {} as Record<keyof T, FormField>;
            Object.keys(initialValues).forEach(key => {
                resetFields[key as keyof T] = {
                    value: initialValues[key] || '',
                    validation: { isValid: true, message: '' }
                };
            });
            return resetFields;
        });
    }, [initialValues]);

    return {
        fields,
        updateField,
        validateField,
        isFormValid,
        getFieldValues,
        resetForm
    };
}
