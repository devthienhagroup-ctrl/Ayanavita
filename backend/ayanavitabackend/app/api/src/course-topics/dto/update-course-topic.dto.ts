import { PartialType } from '@nestjs/mapped-types'
import { CreateCourseTopicDto } from './create-course-topic.dto'

export class UpdateCourseTopicDto extends PartialType(CreateCourseTopicDto) {}
