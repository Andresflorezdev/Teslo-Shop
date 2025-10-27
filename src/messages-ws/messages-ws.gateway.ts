import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from 'src/auth/interfaces';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server
  
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload
    try {
      payload = this.jwtService.verify( token );
      await this.messagesWsService.registerClient( client,payload.id );
    } catch (error) {
      client.disconnect()
      return;
    }

    
    
    //console.log({ payload });
    // console.log('Cliete conectado', client.id);
    //console.log({ conectados: this.messagesWsService.getConnectedClients() });
    

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients() )
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado', client.id);
    //console.log({ desconectados: this.messagesWsService.getConnectedClients() });
    this.messagesWsService.removeClient( client.id );

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients() )
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient( client: Socket, payload: NewMessageDto ) {
    
    //! Emite unicamente al cliente.
    // client.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message!!'
    // })

    //! Emite a todos MENOS, al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message!!'
    // })

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'})

  }

}
