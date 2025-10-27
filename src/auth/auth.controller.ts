import { Controller, Post, Body, Get, UseGuards, Request, SetMetadata} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto, LoginUserDto } from './dto';

import { RoleProtected } from './decorators/role-protected.decorator';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { RawHeaders, GetUser, Auth } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  LoginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login( loginUserDto );
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus( user );
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRouter(
    @Request() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeader: string[],
  ) {
    
    //console.log({ user: request.user });

    return {
      ok: true,
      mesage: 'Hola mundo private',
      user,
      userEmail,
      rawHeader
    }
  }

  // @SetMetadata('roles', ['admin', 'super-user'])

  @Get('private2')
  @RoleProtected( ValidRoles.superUser, ValidRoles.admin,  )
  @UseGuards( AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user:User
  ) {
    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth( ValidRoles.admin)
  privateRoute3(
    @GetUser() user:User
  ) {
    return {
      ok: true,
      user
    }
  }
}




