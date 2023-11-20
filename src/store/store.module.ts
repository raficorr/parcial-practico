import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreEntity } from './store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity])],
  providers: [StoreService],
})
export class StoreModule {}
