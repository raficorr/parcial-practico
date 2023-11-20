/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
//import { ProductDTO}; fro
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductController {
    constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':productID')
  async findOne(@Param('productID') productID: string) {
    return await this.productService.findOne(productID);
  }

  @Post()
  async create(@Body() ProductDto: ProductDto) {
    const museum: ProductEntity = plainToInstance(ProductEntity, ProductDto);
    return await this.productService.create(museum);
  }

  @Put(':ProductID')
  async update(@Param('ProductId') ProductId: string, @Body() ProductDto: ProductDto) {
    const museum: ProductEntity = plainToInstance(ProductEntity, ProductDto);
    return await this.productService.update(ProductId, museum);
  }

  @Delete(':productId')
  @HttpCode(204)
  async delete(@Param('productId') ProductID: string) {
    return await this.productService.delete(ProductID);
  }
}
