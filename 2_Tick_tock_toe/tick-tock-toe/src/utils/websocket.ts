


// message from server: gameStart, waiting, error, gameOver, moveMade, opponentDisconnected
// message from client: join, move
export type MessageType =
  | 'gameStart' | 'waiting' | 'error' | 'gameOver' | 'moveMade'
  | 'opponentDisconnected' | 'join' | 'move';

export interface WebSocketMessage {
  type: MessageType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private messageHandlers: Map<MessageType, (data: any) => void> = new Map()
  private connectionStatusCallback: ((status: ConnectionStatus) => void) | null = null

  constructor(url: string = 'ws://localhost:8080') {
    this.url = url;
  }

  private handleMessage(message: WebSocketMessage) {
    const handler = this.messageHandlers.get(message.type)
    if (handler) {
      handler(message.data)
    }
    else {
      console.log("error, no message type")
    }
  }

  onConnectionStatus(callback: (status: ConnectionStatus) => void) {
    this.connectionStatusCallback = callback;
  }

  private notifyConnectionStatus(status: ConnectionStatus) {
    if (this.connectionStatusCallback) {
      this.connectionStatusCallback(status);
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.notifyConnectionStatus('connecting');
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('Connected to WebSocket server');
          this.notifyConnectionStatus('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.notifyConnectionStatus('error');
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('Disconnected from WebSocket server');
          this.notifyConnectionStatus('disconnected');
        };

        // Set timeout for connection
        const connectionTimeout = setTimeout(() => {
          if (this.ws?.readyState !== WebSocket.OPEN) {
            this.ws?.close();
            this.notifyConnectionStatus('error');
            reject(new Error('Connection timeout'));
          }
        }, 5000);

        // Clear timeout if connection succeeds or fails before timeout
        this.ws.addEventListener('open', () => clearTimeout(connectionTimeout), { once: true });
        this.ws.addEventListener('error', () => clearTimeout(connectionTimeout), { once: true });
      } catch (error) {
        this.notifyConnectionStatus('error');
        reject(error);
      }
    })
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.messageHandlers.clear()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(type: MessageType, data?: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }))
    }
    else {
      console.log('socket is not connected')
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(type: MessageType, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler)
  }

  off(type: MessageType) {
    this.messageHandlers.delete(type);
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  static async testConnection(url: string = 'ws://localhost:8080'): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const ws = new WebSocket(url);

        const timeout = setTimeout(() => {
          ws.close();
          resolve(false);
        }, 3000);

        ws.onopen = () => {
          clearTimeout(timeout);
          ws.close();
          resolve(true);
        };

        ws.onerror = () => {
          clearTimeout(timeout);
          resolve(false);
        };
      } catch {
        resolve(false);
      }
    });
  }
}



