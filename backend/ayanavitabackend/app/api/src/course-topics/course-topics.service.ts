import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCourseTopicDto } from './dto/create-course-topic.dto'
import { UpdateCourseTopicDto } from './dto/update-course-topic.dto'

@Injectable()
export class CourseTopicsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.courseTopic.findMany({
      orderBy: [{ name: 'asc' }],
      include: { _count: { select: { courses: true } } },
    })
  }

  create(dto: CreateCourseTopicDto) {
    return this.prisma.courseTopic.create({ data: dto })
  }

  async update(id: number, dto: UpdateCourseTopicDto) {
    await this.ensureExists(id)
    return this.prisma.courseTopic.update({ where: { id }, data: dto })
  }

  async remove(id: number) {
    await this.ensureExists(id)
    try {
      return await this.prisma.courseTopic.delete({ where: { id }, select: { id: true } })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ConflictException('Chỉ được xóa chủ đề khi không có khóa học nào thuộc chủ đề này.')
      }
      throw error
    }
  }

  private async ensureExists(id: number) {
    const item = await this.prisma.courseTopic.findUnique({ where: { id }, select: { id: true } })
    if (!item) throw new NotFoundException('Không tìm thấy chủ đề khóa học.')
  }
}
