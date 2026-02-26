import { Module } from '@nestjs/common'
import { CourseTopicsController } from './course-topics.controller'
import { CourseTopicsService } from './course-topics.service'

@Module({
  controllers: [CourseTopicsController],
  providers: [CourseTopicsService],
  exports: [CourseTopicsService],
})
export class CourseTopicsModule {}
