import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Job } from './domain/job/job.entity';
import { JobService } from './application/job/job.service';
import { JobController } from './delivery/http/job.controller';
import { UploadModule } from './application/upload/upload.module';

import { JobEventsListener } from './application/job/job.events-listener';

@Module({
  imports: [
    // 0. Global Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 1. SQLite TypeORM Configuration
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Job],
      synchronize: true, // Auto sync table changes (demo only)
    }),
    TypeOrmModule.forFeature([Job]),

    // 2. BullMQ (Redis) Configuration via ConfigService
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<any> => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: Number(configService.get<any>('REDIS_PORT', 6379)),
          password: configService.get<string>('REDIS_PASSWORD'),
          username: configService.get<string>('REDIS_USERNAME'),
          tls: configService.get<string>('REDIS_TLS') === 'true' ? {} : undefined,
        } as any,
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'image-generation-queue',
    }),

    // 3. Static Files Serving (Serve uploads folder statically)
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // 4. Upload Module (handles file uploads, storage strategies)
    UploadModule,
  ],
  controllers: [AppController, JobController],
  providers: [AppService, JobService, JobEventsListener],
})
export class AppModule {}
