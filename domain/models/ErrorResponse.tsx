interface ErrorResponse {
    statusCode: number,
    error?: string,
    message: string | string[]
}

const defaultErrorResponse: ErrorResponse = {
    statusCode: 500,
    error: 'Erro desconhecido',
    message: 'Ocorreu um erro desconhecido, tente novamente'
}


export { ErrorResponse, defaultErrorResponse };