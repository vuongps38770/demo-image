import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from '../../application/upload/upload.service';
import { BadRequestException } from '@nestjs/common';

describe('UploadController', () => {
  let controller: UploadController;
  let mockService: any;

  beforeEach(async () => {
    mockService = {
      uploadImage: jest.fn().mockResolvedValue({
        url: 'http://localhost/uploads/file-123.png',
        filename: 'file-123.png',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should successfully receive uploaded file and delegate to service', async () => {
    const fakeFile: any = {
      buffer: Buffer.from('fake data'),
      originalname: 'test.png',
      mimetype: 'image/png',
      size: 100,
    };

    const fakeReq: any = {
      get: jest.fn().mockReturnValue('localhost'),
      protocol: 'http',
    };

    const result = await controller.uploadFile(fakeFile, fakeReq);

    expect(result.url).toBe('http://localhost/uploads/file-123.png');
    expect(result.filename).toBe('file-123.png');
    expect(result.originalname).toBe('test.png');
    expect(result.size).toBe(100);
    expect(mockService.uploadImage).toHaveBeenCalledWith(
      fakeFile.buffer,
      fakeFile.originalname,
      fakeFile.mimetype,
      'localhost',
      'http',
    );
  });

  it('should throw BadRequestException if no file is provided', async () => {
    const fakeReq: any = {
      get: jest.fn().mockReturnValue('localhost'),
      protocol: 'http',
    };

    await expect(controller.uploadFile(undefined as any, fakeReq)).rejects.toThrow(
      BadRequestException,
    );
  });
});
