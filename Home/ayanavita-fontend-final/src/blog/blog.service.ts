import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePostDto, UpdatePostDto } from "./dto";

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async list(input: {
    q?: string;
    tag?: string;
    sort: "new" | "popular";
    page: number;
    pageSize: number;
  }) {
    const { q, tag, sort, page, pageSize } = input;

    const where: any = {};
    if (tag && tag !== "all") where.tag = tag;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
        { contentMd: { contains: q, mode: "insensitive" } },
      ];
    }

    const orderBy =
      sort === "popular"
        ? [{ views: "desc" as const }, { publishedAt: "desc" as const }]
        : [{ publishedAt: "desc" as const }, { createdAt: "desc" as const }];

    const skip = Math.max(0, (page - 1) * pageSize);
    const take = Math.min(50, Math.max(1, pageSize));

    const [total, items] = await Promise.all([
      this.prisma.blogPost.count({ where }),
      this.prisma.blogPost.findMany({
        where,
        orderBy,
        skip,
        take,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          coverImage: true,
          tag: true,
          authorName: true,
          views: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      items,
      meta: { total, page, pageSize: take, totalPages: Math.ceil(total / take) },
    };
  }

  async detailBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException("Post not found");
    return post;
  }

  create(dto: CreatePostDto) {
    return this.prisma.blogPost.create({
      data: {
        slug: dto.slug,
        title: dto.title,
        excerpt: dto.excerpt,
        coverImage: dto.coverImage,
        tag: dto.tag,
        authorName: dto.authorName,
        contentMd: dto.contentMd,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
      },
    });
  }

  update(id: string, dto: UpdatePostDto) {
    return this.prisma.blogPost.update({
      where: { id },
      data: {
        slug: dto.slug,
        title: dto.title,
        excerpt: dto.excerpt,
        coverImage: dto.coverImage,
        tag: dto.tag,
        authorName: dto.authorName,
        contentMd: dto.contentMd,
        publishedAt: dto.publishedAt === undefined ? undefined : (dto.publishedAt ? new Date(dto.publishedAt) : null),
      },
    });
  }

  remove(id: string) {
    return this.prisma.blogPost.delete({ where: { id } });
  }

  incView(id: string) {
    return this.prisma.blogPost.update({
      where: { id },
      data: { views: { increment: 1 } },
      select: { id: true, views: true },
    });
  }

  async getSaved(userId: string) {
    const rows = await this.prisma.blogSaved.findMany({
      where: { userId },
      select: { postId: true },
      orderBy: { createdAt: "desc" },
    });
    return { ids: rows.map((r) => r.postId) };
  }

  async save(userId: string, postId: string) {
    await this.prisma.blogSaved.upsert({
      where: { userId_postId: { userId, postId } },
      create: { userId, postId },
      update: {},
    });
    return { ok: true };
  }

  async unsave(userId: string, postId: string) {
    await this.prisma.blogSaved.deleteMany({ where: { userId, postId } });
    return { ok: true };
  }

  async clearSaved(userId: string) {
    await this.prisma.blogSaved.deleteMany({ where: { userId } });
    return { ok: true };
  }
}
