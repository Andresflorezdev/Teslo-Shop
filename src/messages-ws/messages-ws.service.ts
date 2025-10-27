import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
    [id: string]: {
        socket :Socket
        user: User
    }
}

@Injectable()
export class MessagesWsService {

    private connectedClients: ConnectedClients = {}

    constructor(
        @InjectRepository(User)
        private readonly userReporitory: Repository<User>
    ) {}

    async registerClient( client: Socket, userId: string ) {

        const user = await this.userReporitory.findOneBy({ id: userId });
        if ( !user ) throw new Error('User not found')
        if ( !user.isActive ) throw new Error('User not activate')

        this.checkUserConnection( user );

        this.connectedClients[client.id] = {
            socket: client,
            user: user,
        };
    }

    removeClient( clientID: string ) {
        delete this.connectedClients[clientID];
    }

    getConnectedClients(): string[] {
        return Object.keys( this.connectedClients );
    }

    getUserFullName( socketId: string ) {
        return this.connectedClients[socketId].user.fullName;
    }

    private checkUserConnection( user: User ) {

        for (const clientId of Object.keys( this.connectedClients )) {
            
            const connectedClient = this.connectedClients[clientId];

            if ( connectedClient.user.id === user.id ) {
                connectedClient.socket.disconnect();
                break;
            }

        }

    }

}
