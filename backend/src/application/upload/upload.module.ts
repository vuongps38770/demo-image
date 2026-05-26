import { Module } from '@nestjs/common';
import { UploadController } from '../../delivery/http/upload.controller';
import { UploadService } from './upload.service';
import { IStorageStrategyToken } from '../../domain/storage/storage.strategy.interface';
import { LocalStorageStrategy } from '../../infrastructure/storage/local-storage.strategy';

@Module({
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: IStorageStrategyToken,
      useClass: LocalStorageStrategy,
    },
  ],
  exports: [UploadService],
})
export class UploadModule {}
