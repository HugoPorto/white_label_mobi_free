import EmailValidator from "./EmailValidator";

export interface ValidationResult {
    isValid: boolean;
    message: string;
}

export class FormValidators {
    static required(value: string, fieldName: string = 'Campo'): ValidationResult {
        if (!value || value.trim().length === 0) {
            return { isValid: false, message: `${fieldName} é obrigatório` };
        }
        return { isValid: true, message: '' };
    }

    static minLength(value: string, minLength: number, fieldName: string = 'Campo'): ValidationResult {
        if (value.length < minLength) {
            return { 
                isValid: false, 
                message: `${fieldName} deve ter pelo menos ${minLength} caracteres` 
            };
        }
        return { isValid: true, message: '' };
    }

    static email(value: string): ValidationResult {
        if (!EmailValidator(value)) {
            return { isValid: false, message: 'E-mail inválido' };
        }
        return { isValid: true, message: '' };
    }

    static phone(value: string): ValidationResult {
        const phoneRegex = /^(\(?\d{2}\)?[\s-]?)[\d\s-]{8,9}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            return { isValid: false, message: 'Telefone inválido' };
        }
        return { isValid: true, message: '' };
    }

    static password(value: string): ValidationResult {
        if (value.length < 6) {
            return { 
                isValid: false, 
                message: 'A senha deve ter pelo menos 6 caracteres' 
            };
        }
        
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            return { 
                isValid: false, 
                message: 'A senha deve conter ao menos 1 letra maiúscula, 1 minúscula e 1 número' 
            };
        }
        
        return { isValid: true, message: '' };
    }

    static confirmPassword(password: string, confirmPassword: string): ValidationResult {
        if (password !== confirmPassword) {
            return { isValid: false, message: 'Senhas não coincidem' };
        }
        return { isValid: true, message: '' };
    }

    static combine(...validators: ((value: string) => ValidationResult)[]): (value: string) => ValidationResult {
        return (value: string) => {
            for (const validator of validators) {
                const result = validator(value);
                if (!result.isValid) {
                    return result;
                }
            }
            return { isValid: true, message: '' };
        };
    }
}

export const formatPhone = (text: string): string => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return cleaned;
};
