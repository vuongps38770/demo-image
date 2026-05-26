import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('jobs')
export class Job {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  type: string;

  @Column()
  prompt: string;

  @Column({ default: 'queued' })
  status: string;

  @Column({ default: 0 })
  progress: number;

  @Column({ name: 'result_url', type: 'varchar', nullable: true })
  resultUrl: string | null;

  @Column({ name: 'asset_name', type: 'varchar', nullable: true })
  assetName: string | null;

  @Column({ name: 'asset_img_url', type: 'varchar', nullable: true })
  assetImgUrl: string | null;

  @Column({ name: 'aspect_ratio', type: 'varchar', nullable: true })
  aspectRatio: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
