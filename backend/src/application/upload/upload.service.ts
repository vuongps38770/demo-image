import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IStorageStrategyToken } from '../../domain/storage/storage.strategy.interface';
import type { IStorageStrategy } from '../../domain/storage/storage.strategy.interface';
import { extname } from 'path';

@Injectable()
export class UploadService {
  constructor(
    @Inject(IStorageStrategyToken)
    private readonly storageStrategy: IStorageStrategy,
  ) {}

  async uploadImage(
    buffer: Buffer,
    originalName: string,
    mimetype: string,
    host: string,
    protocol: string,
  ): Promise<{ url: string; filename: string }> {
    // 1. Validate Mimetype
    if (!mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      throw new BadRequestException('Only image files are allowed!');
    }

    // 2. Validate Buffer
    if (!buffer || buffer.length === 0) {
      throw new BadRequestException('Empty file buffer provided');
    }

    // 3. Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(originalName) || '.png';
    const filename = `file-${uniqueSuffix}${ext}`;

    // 4. Save file via strategy
    await this.storageStrategy.saveFile(buffer, filename);

    // 5. Generate URL
    const url = this.storageStrategy.getStaticUrl(filename, host, protocol);

    return { url, filename };
  }
}
