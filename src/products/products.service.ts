import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import {validate as isUUID} from 'uuid'
import { title } from 'process';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor (

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ) {}


  async create(createProductDto: CreateProductDto) {

    try {

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save( product );

      return product;

    } catch (error) {
      this.handleDBExeptions(error);
    }

  }

  // 🔹 Modificado: ahora devuelve todos los productos reales desde la BD
  async findAll(paginationDto:PaginationDto) {
    
    const { limit = 0, offset = 0 } = paginationDto;
    
    return this.productRepository.find({
      take: limit,
      skip: offset,
      // Todo relaciones
    });
  }

  // 🔹 Modificado: busca un producto específico por su id
  async findOne(term: string) {
    
    let product: Product | null;

    if ( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id: term });
    } else{
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder.where(' UPPER(title) =:title or slug =:slug', {
        title: term.toUpperCase(),
        slug: term.toLocaleLowerCase(),
      }).getOne();
    }

    
    if (!product) throw new NotFoundException(`Producto con id "${term}" no encontrado`);
    return product;
  }


  async update(id: string, updateProductDto: UpdateProductDto) {
    
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if ( !product ) throw new NotFoundException(`Product with id: ${ id } not found`)
    
    try {
      await this.productRepository.save( product );
      return product;
    } catch (error) {
      this.handleDBExeptions(error);
    }

  }

  // 🔹 Modificado: ahora elimina realmente el producto por id
  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: `Producto con id "${id}" eliminado correctamente` };
  }


  private handleDBExeptions(error:any) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

  this.logger.error(error);
  // console.log(error);
  throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
