import { 
  Controller, 
  Post, 
  Get, 
  Delete,
  Body, 
  Headers, 
  Param, 
  BadRequestException,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { JobService } from '../../application/job/job.service';
import { Job } from '../../domain/job/job.entity';

class CreateJobDto {
  type: string;
  prompt: string;
  assetName?: string;
  assetImgUrl?: string;
  aspectRatio?: string;
}

@Controller('api/jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async create(
    @Headers('x-username') username: string,
    @Body() dto: CreateJobDto,
  ): Promise<Job> {
    if (!username) {
      throw new BadRequestException('Missing x-username header');
    }
    if (!dto.type || !dto.prompt) {
      throw new BadRequestException('Missing type or prompt in request body');
    }
    return this.jobService.createJob(
      username,
      dto.type,
      dto.prompt,
      dto.assetName,
      dto.assetImgUrl,
      dto.aspectRatio,
    );
  }

  @Get('me')
  async getMe(@Headers('x-username') username: string): Promise<Job[]> {
    if (!username) {
      throw new BadRequestException('Missing x-username header');
    }
    return this.jobService.getUserJobs(username);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Job> {
    if (!id) {
      throw new BadRequestException('Missing job ID');
    }
    return this.jobService.getJobById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException('Missing job ID');
    }
    return this.jobService.deleteJob(id);
  }
}
