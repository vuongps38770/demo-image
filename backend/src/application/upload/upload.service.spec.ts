import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { IStorageStrategyToken } from '../../domain/storage/storage.strategy.interface';
import { BadRequestException } from '@nestjs/common';

describe('UploadService', () => {
  let service: UploadService;
  let mockStrategy: any;

  beforeEach(async () => {
    mockStrategy = {
      saveFile: jest.fn().mockResolvedValue('mock-file-123.png'),
      getStaticUrl: jest.fn().mockImplementation((filename) => `http://localhost/uploads/${filename}`),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: IStorageStrategyToken,
          useValue: mockStrategy,
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload image successfully', async () => {
    const buffer = Buffer.from('fake image data');
    const result = await service.uploadImage(
      buffer,
      'test.png',
      'image/png',
      'localhost',
      'http',
    );

    expect(result.url).toContain('http://localhost/uploads/file-');
    expect(result.filename).toContain('file-');
    expect(mockStrategy.saveFile).toHaveBeenCalled();
  });

  it('should throw BadRequestException for invalid mimetype', async () => {
    const buffer = Buffer.from('fake txt data');
    
    await expect(
      service.uploadImage(buffer, 'test.txt', 'text/plain', 'localhost', 'http')
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for empty buffer', async () => {
    const buffer = Buffer.alloc(0);
    
    await expect(
      service.uploadImage(buffer, 'test.png', 'image/png', 'localhost', 'http')
    ).rejects.toThrow(BadRequestException);
  });
});
