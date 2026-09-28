import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private userSockets = new Map<string, string[]>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      const sockets = this.userSockets.get(userId) || [];
      sockets.push(client.id);
      this.userSockets.set(userId, sockets);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSockets.entries()) {
      const filtered = sockets.filter((s) => s !== client.id);
      if (filtered.length === 0) {
        this.userSockets.delete(userId);
      } else {
        this.userSockets.set(userId, filtered);
      }
    }
  }

  @SubscribeMessage('subscribe:machine')
  handleMachineSubscribe(client: Socket, machineId: string) {
    client.join(`machine:${machineId}`);
  }

  @SubscribeMessage('subscribe:notifications')
  handleNotificationSubscribe(client: Socket, userId: string) {
    client.join(`notifications:${userId}`);
  }

  emitMachineStatus(machineId: string, data: any) {
    this.server.to(`machine:${machineId}`).emit('machine:status', data);
  }

  emitNotification(userId: string, data: any) {
    this.server.to(`notifications:${userId}`).emit('notification:new', data);
  }

  emitTransaction(userId: string, data: any) {
    this.server.to(`notifications:${userId}`).emit('transaction:new', data);
  }
}
