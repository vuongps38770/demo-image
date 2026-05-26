import { Injectable } from '@nestjs/common';
import { IStorageStrategy } from '../../domain/storage/storage.strategy.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalStorageStrategy implements IStorageStrategy {
  private readonly uploadDir = './uploads';

  constructor() {
    // Ensure directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(buffer: Buffer, filename: string): Promise<string> {
    const filePath = path.join(this.uploadDir, filename);
    await fs.promises.writeFile(filePath, buffer);
    return filename;
  }

  getStaticUrl(filename: string, host: string, protocol: string): string {
    return `${protocol}://${host}/uploads/${filename}`;
  }
}
