import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateLessonDto } from './dto/create-lesson.dto'
import { UpdateLessonDto } from './dto/update-lesson.dto'
import { EnrollmentsService } from '../enrollments/enrollments.service'
import { LessonsMediaService } from './lessons-media.service'
import { JwtUser } from '../auth/decorators/current-user.decorator'
import { ProgressStatus } from '@prisma/client'

@Injectable()
export class LessonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly enrollments: EnrollmentsService,
    private readonly media: LessonsMediaService,
  ) {}

  async findOne(user: JwtUser, id: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      select: {
        id: true,
        courseId: true,
        title: true,
        slug: true,
        description: true,
        titleI18n: true,
        descriptionI18n: true,
        order: true,
        published: true,
        content: true,
        videoUrl: true,
        createdAt: true,
        updatedAt: true,
        modules: {
          where: user.role === 'ADMIN' ? {} : { published: true },
          orderBy: [{ order: 'asc' }, { id: 'asc' }],
          select: {
            id: true,
            title: true,
            description: true,
            titleI18n: true,
            descriptionI18n: true,
            order: true,
            published: true,
            videos: {
              where: user.role === 'ADMIN' ? {} : { published: true },
              orderBy: [{ order: 'asc' }, { id: 'asc' }],
              select: {
                id: true,
                title: true,
                description: true,
                titleI18n: true,
                descriptionI18n: true,
                sourceUrl: true,
                hlsPlaylistKey: true,
                durationSec: true,
                order: true,
                published: true,
              },
            },
          },
        },
      },
    })
    if (!lesson) throw new NotFoundException('Lesson not found')

    await this.enrollments.assertEnrolledOrAdmin(user, lesson.courseId)

    if (user.role !== 'ADMIN' && !lesson.published) {
      throw new NotFoundException('Lesson not found')
    }

    if (user.role !== 'ADMIN') {
      const prev = await this.prisma.lesson.findFirst({
        where: {
          courseId: lesson.courseId,
          published: true,
          OR: [{ order: { lt: lesson.order ?? 0 } }, { order: lesson.order ?? 0, id: { lt: lesson.id } }],
        },
        select: { id: true },
        orderBy: [{ order: 'desc' }, { id: 'desc' }],
      })

      if (prev) {
        const prevProgress = await this.prisma.lessonProgress.findUnique({
          where: { userId_lessonId: { userId: user.sub, lessonId: prev.id } },
          select: { status: true },
        })
        if (!prevProgress || prevProgress.status !== ProgressStatus.COMPLETED) {
          throw new ForbiddenException('Complete previous lesson first')
        }
      }
    }

    return lesson
  }

  async create(courseId: number, dto: CreateLessonDto) {
    return this.prisma.$transaction(async (tx) => {
      const lesson = await tx.lesson.create({
        data: {
          courseId,
          title: dto.title,
          slug: dto.slug,
          description: dto.description,
          titleI18n: dto.titleI18n as any,
          descriptionI18n: dto.descriptionI18n as any,
          content: dto.content,
          videoUrl: dto.videoUrl,
          order: dto.order,
          published: dto.published,
        } as any,
      })

      if (dto.modules?.length) {
        for (const m of dto.modules) {
          const mod = await tx.lessonModule.create({
            data: {
              lessonId: lesson.id,
              title: m.title,
              description: m.description,
              titleI18n: m.titleI18n as any,
              descriptionI18n: m.descriptionI18n as any,
              order: m.order,
              published: m.published,
            } as any,
          })

          if (m.videos?.length) {
            await tx.lessonVideo.createMany({
              data: m.videos.map((v, idx) => ({
                moduleId: mod.id,
                title: v.title,
                description: v.description,
                titleI18n: v.titleI18n as any,
                descriptionI18n: v.descriptionI18n as any,
                sourceUrl: v.sourceUrl,
                durationSec: v.durationSec ?? 0,
                order: v.order ?? idx,
                published: v.published ?? true,
              })) as any,
            })
          }
        }
      }

      return lesson
    })
  }

  async uploadModuleVideo(lessonId: number, moduleId: string, file: { buffer: Buffer; originalname?: string }) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId }, select: { id: true } })
    if (!lesson) throw new NotFoundException('Lesson not found')

    const upload = await this.media.transcodeToHlsAndUpload(file, lessonId, moduleId)

    return {
      moduleId,
      lessonId,
      hlsPlaylistKey: upload.playlistKey,
      segmentCount: upload.segmentKeys.length,
      storage: 'private-bucket',
    }
  }

  async update(id: number, dto: UpdateLessonDto) {
    return this.prisma.$transaction(async (tx) => {
      const lesson = await tx.lesson.update({
        where: { id },
        data: {
          title: dto.title,
          slug: dto.slug,
          description: dto.description,
          titleI18n: dto.titleI18n as any,
          descriptionI18n: dto.descriptionI18n as any,
          content: dto.content,
          videoUrl: dto.videoUrl,
          order: dto.order,
          published: dto.published,
        } as any,
      })

      if (dto.modules) {
        await tx.lessonVideo.deleteMany({ where: { module: { lessonId: id } } as any })
        await tx.lessonModule.deleteMany({ where: { lessonId: id } })

        for (const m of dto.modules) {
          const mod = await tx.lessonModule.create({
            data: {
              lessonId: id,
              title: m.title,
              description: m.description,
              titleI18n: m.titleI18n as any,
              descriptionI18n: m.descriptionI18n as any,
              order: m.order,
              published: m.published,
            } as any,
          })

          if (m.videos?.length) {
            await tx.lessonVideo.createMany({
              data: m.videos.map((v, idx) => ({
                moduleId: mod.id,
                title: v.title,
                description: v.description,
                titleI18n: v.titleI18n as any,
                descriptionI18n: v.descriptionI18n as any,
                sourceUrl: v.sourceUrl,
                durationSec: v.durationSec ?? 0,
                order: v.order ?? idx,
                published: v.published ?? true,
              })) as any,
            })
          }
        }
      }

      return lesson
    })
  }

  remove(id: number) {
    return this.prisma.lesson.delete({ where: { id } })
  }
}
