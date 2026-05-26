import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Job } from '../../domain/job/job.entity';
import { getQueueToken } from '@nestjs/bullmq';
import { NotFoundException } from '@nestjs/common';

describe('JobService', () => {
  let service: JobService;
  let mockRepository: any;
  let mockQueue: any;

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn().mockImplementation((job) => Promise.resolve(job)),
      find: jest.fn().mockResolvedValue([{ id: 'job-1', username: 'test_user' }]),
      findOne: jest.fn().mockResolvedValue(null),
    };

    mockQueue = {
      add: jest.fn().mockResolvedValue({ id: 'bull-job-id' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: getRepositoryToken(Job),
          useValue: mockRepository,
        },
        {
          provide: getQueueToken('image-generation-queue'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<JobService>(JobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createJob', () => {
    it('should create and save job, then add to BullMQ queue', async () => {
      const result = await service.createJob(
        'test_user',
        'text-to-image',
        'a cute cat',
      );

      expect(result).toBeDefined();
      expect(result.username).toBe('test_user');
      expect(result.status).toBe('queued');
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalled();
    });
  });

  describe('getUserJobs', () => {
    it('should fetch jobs for user from repository', async () => {
      const result = await service.getUserJobs('test_user');
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { username: 'test_user' },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('getJobById', () => {
    it('should return job if found', async () => {
      const fakeJob = { id: 'job-123', username: 'test_user' };
      mockRepository.findOne.mockResolvedValue(fakeJob);

      const result = await service.getJobById('job-123');
      expect(result).toEqual(fakeJob);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'job-123' } });
    });

    it('should throw NotFoundException if job not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getJobById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
