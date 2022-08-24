import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './post.model';
import { User } from '../users/user.model';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [SequelizeModule.forFeature([Post, User]), FilesModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
