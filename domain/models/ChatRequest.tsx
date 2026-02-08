export interface ChatRequest {
    text: string,
    timestamp: Date,
    isMe: boolean,
    status: 'read' | 'unread',
    type: 'text' | 'image' | 'video',
    id_user: number,
    id_sender: number,
    id_receiver: number,
    id_client_request?: number
    is_driver?: boolean
}