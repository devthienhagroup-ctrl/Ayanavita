import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EnrollmentsService } from "../enrollments/enrollments.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { Prisma, ProgressStatus } from "@prisma/client";

type JwtUser = { sub: number; role: string }

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly enrollments: EnrollmentsService
  ) {}

  private readonly baseCourseSelect = {
    id: true,
    topicId: true,
    title: true,
    slug: true,
    description: true,
    thumbnail: true,
    price: true,
    published: true,
    titleI18n: true,
    descriptionI18n: true,
    shortDescriptionI18n: true,
    objectives: true,
    targetAudience: true,
    benefits: true,
    ratingAvg: true,
    ratingCount: true,
    enrollmentCount: true,
    createdAt: true,
    updatedAt: true,
    topic: { select: { id: true, name: true } },
    _count: { select: { lessons: true } },
  } as const

  private buildCreateCoursePayload(dto: CreateCourseDto & { title: string }): Prisma.CourseUncheckedCreateInput {
    return {
      title: dto.title,
      slug: dto.slug,
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.thumbnail !== undefined ? { thumbnail: dto.thumbnail } : {}),
      ...(dto.price !== undefined ? { price: dto.price } : {}),
      ...(dto.published !== undefined ? { published: dto.published } : {}),
      ...(dto.topicId !== undefined ? { topicId: dto.topicId } : {}),
      ...(dto.titleI18n !== undefined ? { titleI18n: dto.titleI18n as any } : {}),
      ...(dto.descriptionI18n !== undefined ? { descriptionI18n: dto.descriptionI18n as any } : {}),
      ...(dto.shortDescriptionI18n !== undefined ? { shortDescriptionI18n: dto.shortDescriptionI18n as any } : {}),
      ...(dto.objectives !== undefined ? { objectives: dto.objectives as any } : {}),
      ...(dto.targetAudience !== undefined ? { targetAudience: dto.targetAudience as any } : {}),
      ...(dto.benefits !== undefined ? { benefits: dto.benefits as any } : {}),
      ...(dto.ratingAvg !== undefined ? { ratingAvg: dto.ratingAvg } : {}),
      ...(dto.ratingCount !== undefined ? { ratingCount: dto.ratingCount } : {}),
      ...(dto.enrollmentCount !== undefined ? { enrollmentCount: dto.enrollmentCount } : {}),
    }
  }

  private buildUpdateCoursePayload(dto: UpdateCourseDto): Prisma.CourseUncheckedUpdateInput {
    return {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.slug !== undefined ? { slug: dto.slug } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.thumbnail !== undefined ? { thumbnail: dto.thumbnail } : {}),
      ...(dto.price !== undefined ? { price: dto.price } : {}),
      ...(dto.published !== undefined ? { published: dto.published } : {}),
      ...(dto.topicId !== undefined ? { topicId: dto.topicId } : {}),
      ...(dto.titleI18n !== undefined ? { titleI18n: dto.titleI18n as any } : {}),
      ...(dto.descriptionI18n !== undefined ? { descriptionI18n: dto.descriptionI18n as any } : {}),
      ...(dto.shortDescriptionI18n !== undefined ? { shortDescriptionI18n: dto.shortDescriptionI18n as any } : {}),
      ...(dto.objectives !== undefined ? { objectives: dto.objectives as any } : {}),
      ...(dto.targetAudience !== undefined ? { targetAudience: dto.targetAudience as any } : {}),
      ...(dto.benefits !== undefined ? { benefits: dto.benefits as any } : {}),
      ...(dto.ratingAvg !== undefined ? { ratingAvg: dto.ratingAvg } : {}),
      ...(dto.ratingCount !== undefined ? { ratingCount: dto.ratingCount } : {}),
      ...(dto.enrollmentCount !== undefined ? { enrollmentCount: dto.enrollmentCount } : {}),
    }
  }

  async lessonsOutline(user: JwtUser, courseId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, published: true },
    })
    if (!course) throw new NotFoundException('Course not found')

    if (user.role !== 'ADMIN' && !course.published) {
      throw new NotFoundException('Course not found')
    }

    return this.prisma.lesson.findMany({
      where: {
        courseId,
        ...(user.role === 'ADMIN' ? {} : { published: true }),
      },
      select: {
        id: true,
        courseId: true,
        title: true,
        slug: true,
        order: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    })
  }

  findAll() {
    return this.prisma.course.findMany({
      select: this.baseCourseSelect,
      orderBy: { id: "desc" },
    });
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      select: this.baseCourseSelect,
    });
    if (!course) throw new NotFoundException("Course not found");
    return course;
  }

  async create(dto: CreateCourseDto) {
    if (!dto.title?.trim()) {
      throw new BadRequestException("Title is required")
    }

    try {
      return await this.prisma.course.create({
        data: this.buildCreateCoursePayload({ ...dto, title: dto.title.trim() }),
        select: this.baseCourseSelect,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        const target = (e.meta as any)?.target;
        if (Array.isArray(target) ? target.includes("slug") : String(target).includes("slug")) {
          throw new ConflictException("Slug already exists");
        }
        throw new ConflictException("Unique constraint failed");
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateCourseDto) {
    await this.ensureCourseExists(id);
    return this.prisma.course.update({
      where: { id },
      data: this.buildUpdateCoursePayload(dto),
      select: this.baseCourseSelect,
    });
  }

  async remove(id: number) {
    await this.ensureCourseExists(id);
    return this.prisma.course.delete({ where: { id }, select: { id: true } });
  }

  async listLessons(user: { sub: number; role: string }, courseId: number) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId }, select: { id: true, published: true } });
    if (!course) throw new NotFoundException("Course not found");
    await this.enrollments.assertEnrolledOrAdmin(user, courseId);
    if (user.role !== "ADMIN" && !course.published) throw new NotFoundException("Course not found");

    const lessons = await this.prisma.lesson.findMany({
      where: { courseId, ...(user.role === "ADMIN" ? {} : { published: true }) },
      select: { id: true, courseId: true, title: true, slug: true, order: true, published: true, createdAt: true, updatedAt: true },
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });

    if (user.role === "ADMIN") return lessons.map((l) => ({ ...l, locked: false, lockReason: null, progress: null }));

    const progressRows = await this.prisma.lessonProgress.findMany({
      where: { userId: user.sub, lessonId: { in: lessons.map((l) => l.id) } },
      select: { lessonId: true, status: true, percent: true, lastPositionSec: true, lastOpenedAt: true, completedAt: true, updatedAt: true },
    });

    const progressMap = new Map(progressRows.map((p) => [p.lessonId, p]));
    let prevCompleted = true;
    return lessons.map((lesson, idx) => {
      const progress = progressMap.get(lesson.id) ?? null;
      const locked = idx === 0 ? false : prevCompleted === false;
      const lockReason = locked ? "PREV_NOT_COMPLETED" : null;
      prevCompleted = progress?.status === ProgressStatus.COMPLETED;
      return { ...lesson, locked, lockReason, progress };
    });
  }

  async getLessonDetail(user: { sub: number; role: string }, courseId: number, lessonId: number) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId }, select: { id: true, published: true } });
    if (!course) throw new NotFoundException("Course not found");
    await this.enrollments.assertEnrolledOrAdmin(user, courseId);
    if (user.role !== "ADMIN" && !course.published) throw new NotFoundException("Course not found");

    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, courseId },
      select: { id: true, courseId: true, title: true, slug: true, content: true, videoUrl: true, order: true, published: true, createdAt: true, updatedAt: true },
    });
    if (!lesson) throw new NotFoundException("Lesson not found");
    if (user.role !== "ADMIN" && !lesson.published) throw new NotFoundException("Lesson not found");

    if (user.role !== "ADMIN") {
      const orderedLessons = await this.prisma.lesson.findMany({ where: { courseId, published: true }, select: { id: true }, orderBy: [{ order: "asc" }, { id: "asc" }] });
      const idx = orderedLessons.findIndex((l) => l.id === lessonId);
      if (idx < 0) throw new NotFoundException("Lesson not found");
      if (idx > 0) {
        const prevLessonId = orderedLessons[idx - 1].id;
        const prevProgress = await this.prisma.lessonProgress.findUnique({ where: { userId_lessonId: { userId: user.sub, lessonId: prevLessonId } }, select: { status: true } });
        const unlocked = prevProgress?.status === ProgressStatus.COMPLETED;
        if (!unlocked) throw new ForbiddenException("Lesson locked");
      }
    }

    const progress = await this.prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: user.sub, lessonId } },
      select: { lessonId: true, status: true, percent: true, lastPositionSec: true, lastOpenedAt: true, completedAt: true, updatedAt: true },
    });

    return { ...lesson, progress: progress ?? null };
  }

  private async ensureCourseExists(id: number) {
    const ok = await this.prisma.course.findUnique({ where: { id }, select: { id: true } });
    if (!ok) throw new NotFoundException("Course not found");
  }
}
