export interface ChatResponse {
    id: number,
    text: string,
    timestamp: Date,
    isMe: boolean,
    status: 'read' | 'unread',
    type: 'text' | 'image' | 'video',
}