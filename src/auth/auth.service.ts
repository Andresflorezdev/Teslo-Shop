import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-pyload.interface';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    
    try {

      const {password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      });

      const savedUser = await this.userRepository.save( user )
      
        // Quitar el campo password antes de devolver la respuesta
      const { password: _, ...userWithoutPassword } = savedUser;

      return {
        ...userWithoutPassword,
        token: this.getJwToken({ id: user.id })
      };
      // TODO: Retornar el JWT de acceso

    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  async login( loginUserDto: LoginUserDto ) {
    
    const { password, email } = loginUserDto

    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, password: true, id: true}
    });

    if ( !user )
      throw new UnauthorizedException('Credentials are not valid (email)');

    if ( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid (password)');
      
    return {
      ...user,
      token: this.getJwToken({ id: user.id })
    };
  
  }

  async checkAuthStatus( user: User ) {

    return {
      ...user,
      token: this.getJwToken({ id: user.id })
    };

  }

  private getJwToken( payload: JwtPayload ){

    const token = this.jwtService.sign( payload );
    return token;

  }

  private handleDBErrors( error:any ): never {

  if ( error.code === '2225')
    throw new BadRequestException( error.detail )
    
    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  
}

}
