import { IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateCourseTopicDto {
  @IsString()
  @MaxLength(120)
  name!: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string
}
