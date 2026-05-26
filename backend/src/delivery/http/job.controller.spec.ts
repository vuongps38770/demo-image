import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from './job.controller';
import { JobService } from '../../application/job/job.service';
import { BadRequestException } from '@nestjs/common';

describe('JobController', () => {
  let controller: JobController;
  let mockService: any;

  beforeEach(async () => {
    mockService = {
      createJob: jest.fn().mockImplementation((username, type, prompt) => 
        Promise.resolve({ id: 'job-123', username, type, prompt, status: 'queued' })
      ),
      getUserJobs: jest.fn().mockResolvedValue([{ id: 'job-123', username: 'test_user' }]),
      getJobById: jest.fn().mockResolvedValue({ id: 'job-123', username: 'test_user' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobController],
      providers: [
        {
          provide: JobService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<JobController>(JobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a job when valid inputs are given', async () => {
      const result = await controller.create('test_user', {
        type: 'text-to-image',
        prompt: 'a beautiful view',
      });

      expect(result).toBeDefined();
      expect(result.id).toBe('job-123');
      expect(result.username).toBe('test_user');
      expect(mockService.createJob).toHaveBeenCalledWith(
        'test_user',
        'text-to-image',
        'a beautiful view',
        undefined,
        undefined,
      );
    });

    it('should throw BadRequestException if x-username is missing', async () => {
      await expect(
        controller.create('', { type: 'text-to-image', prompt: 'a prompt' })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getMe', () => {
    it('should fetch user jobs', async () => {
      const result = await controller.getMe('test_user');
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(mockService.getUserJobs).toHaveBeenCalledWith('test_user');
    });

    it('should throw BadRequestException if x-username is missing', async () => {
      await expect(controller.getMe('')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getById', () => {
    it('should fetch job by ID', async () => {
      const result = await controller.getById('job-123');
      expect(result).toBeDefined();
      expect(result.id).toBe('job-123');
      expect(mockService.getJobById).toHaveBeenCalledWith('job-123');
    });
  });
});
