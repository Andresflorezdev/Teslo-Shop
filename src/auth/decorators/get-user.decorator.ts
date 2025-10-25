import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common"



export const GetUser = createParamDecorator(
    ( data: string, cxt: ExecutionContext ) => {
        
        const req = cxt.switchToHttp().getRequest();
        const user = req.user;

        if ( !user )
            throw new InternalServerErrorException(' User not found (request) ')
        
        return ( !data ) 
        ? user: 
        user[data];
    }

);