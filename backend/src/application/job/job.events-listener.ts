import { QueueEventsHost, QueueEventsListener, OnQueueEvent } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../../domain/job/job.entity';

@Injectable()
@QueueEventsListener('image-generation-queue')
export class JobEventsListener extends QueueEventsHost {
  private readonly logger = new Logger(JobEventsListener.name);

  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {
    super();
  }

  @OnQueueEvent('active')
  async onActive(job: { jobId: string; prev?: string }) {
    this.logger.log(`Job ${job.jobId} is active (started processing)`);
    try {
      await this.jobRepository.update(job.jobId, {
        status: 'processing',
        progress: 0,
      });
    } catch (error) {
      this.logger.error(`Failed to update job ${job.jobId} to active: ${error.message}`);
    }
  }

  @OnQueueEvent('progress')
  async onProgress(job: { jobId: string; data: number | string }) {
    const progressVal = typeof job.data === 'string' ? parseInt(job.data, 10) : job.data;
    this.logger.log(`Job ${job.jobId} progress: ${progressVal}%`);
    try {
      await this.jobRepository.update(job.jobId, {
        progress: isNaN(progressVal) ? 0 : progressVal,
      });
    } catch (error) {
      this.logger.error(`Failed to update job ${job.jobId} progress: ${error.message}`);
    }
  }

  @OnQueueEvent('completed')
  async onCompleted(job: { jobId: string; returnvalue: string }) {
    this.logger.log(`Job ${job.jobId} completed successfully`);
    try {
      await this.jobRepository.update(job.jobId, {
        status: 'completed',
        progress: 100,
        resultUrl: job.returnvalue,
      });
    } catch (error) {
      this.logger.error(`Failed to update job ${job.jobId} to completed: ${error.message}`);
    }
  }

  @OnQueueEvent('failed')
  async onFailed(job: { jobId: string; failedReason: string }) {
    this.logger.warn(`Job ${job.jobId} failed: ${job.failedReason}`);
    try {
      await this.jobRepository.update(job.jobId, {
        status: 'failed',
      });
    } catch (error) {
      this.logger.error(`Failed to update job ${job.jobId} to failed: ${error.message}`);
    }
  }
}
