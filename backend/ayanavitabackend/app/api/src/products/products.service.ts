import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { QueryProductsDto } from "./dto/query-products.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeConcerns(value?: string[] | string) {
    if (!value) return "";
    if (Array.isArray(value)) return value.map((x) => x.trim()).filter(Boolean).join(",");
    return value;
  }

  private mapProduct<T extends { concerns: string }>(item: T) {
    return { ...item, concerns: item.concerns ? item.concerns.split(",").map((x) => x.trim()).filter(Boolean) : [] };
  }

  async findAll(query: QueryProductsDto, forcePublished = true) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 12;
    const skip = (page - 1) * pageSize;
    const publishedOnly = forcePublished && !query.includeUnpublished;

    const where: Prisma.ProductWhereInput = {
      ...(publishedOnly ? { published: true } : {}),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" } },
              { sku: { contains: query.q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.concern ? { concerns: { contains: query.concern } } : {}),
      ...(query.minPrice !== undefined || query.maxPrice !== undefined
        ? {
            price: {
              ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
              ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
            },
          }
        : {}),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput[] =
      query.sort === "new"
        ? [{ createdAt: "desc" }]
        : query.sort === "priceAsc"
          ? [{ price: "asc" }]
          : query.sort === "priceDesc"
            ? [{ price: "desc" }]
            : query.sort === "rating"
              ? [{ rating: "desc" }]
              : [{ sold: "desc" }, { rating: "desc" }];

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map((x) => this.mapProduct(x)),
      paging: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  }

  async findOneBySlug(slug: string, includeUnpublished = false) {
    const item = await this.prisma.product.findFirst({
      where: { slug, ...(includeUnpublished ? {} : { published: true }) },
    });
    if (!item) throw new NotFoundException("Product not found");
    return this.mapProduct(item);
  }

  async findOne(id: number) {
    const item = await this.prisma.product.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Product not found");
    return this.mapProduct(item);
  }

  async create(dto: CreateProductDto) {
    try {
      return this.mapProduct(await this.prisma.product.create({ data: { ...dto, concerns: this.normalizeConcerns(dto.concerns) } }));
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("SKU or slug already exists");
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.mapProduct(await this.prisma.product.update({ where: { id }, data: { ...dto, ...(dto.concerns ? { concerns: this.normalizeConcerns(dto.concerns) } : {}) } }));
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.mapProduct(await this.prisma.product.delete({ where: { id } }));
  }
}
