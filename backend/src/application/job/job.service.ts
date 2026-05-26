import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Job } from '../../domain/job/job.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectQueue('image-generation-queue')
    private readonly jobQueue: Queue,
  ) {}

  async createJob(
    username: string,
    type: string,
    prompt: string,
    assetName?: string,
    assetImgUrl?: string,
    aspectRatio?: string,
  ): Promise<Job> {
    const job = new Job();
    job.id = randomUUID();
    job.username = username;
    job.type = type;
    job.prompt = prompt;
    job.status = 'queued';
    job.progress = 0;
    job.assetName = assetName || null;
    job.assetImgUrl = assetImgUrl || null;
    job.aspectRatio = aspectRatio || null;
    job.resultUrl = null;
    job.createdAt = new Date();

    // 1. Save to SQLite database
    const savedJob = await this.jobRepository.save(job);

    // 2. Push to BullMQ queue for worker processing
    await this.jobQueue.add(
      'generate',
      {
        id: savedJob.id,
        username: savedJob.username,
        type: savedJob.type,
        prompt: savedJob.prompt,
        assetName: savedJob.assetName,
        assetImgUrl: savedJob.assetImgUrl,
        aspectRatio: savedJob.aspectRatio || undefined,
      },
      {
        jobId: savedJob.id, // match BullMQ job ID with our database UUID
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return savedJob;
  }

  async getUserJobs(username: string): Promise<Job[]> {
    return this.jobRepository.find({
      where: { username },
      order: { createdAt: 'DESC' },
    });
  }

  async getJobById(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }

  async deleteJob(id: string): Promise<void> {
    const job = await this.jobRepository.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    await this.jobRepository.remove(job);
  }
}
