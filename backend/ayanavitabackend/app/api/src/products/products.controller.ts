import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";

import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CreateProductDto } from "./dto/create-product.dto";
import { QueryProductsDto } from "./dto/query-products.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  // Public list + filter
  @Get()
  findAll(@Query() query: QueryProductsDto) {
    return this.products.findAll(query, true);
  }

  // Public detail by slug
  @Get("slug/:slug")
  findOneBySlug(@Param("slug") slug: string) {
    return this.products.findOneBySlug(slug, false);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles("ADMIN")
  @Get("admin")
  adminFindAll(@Query() query: QueryProductsDto) {
    return this.products.findAll(query, false);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles("ADMIN")
  @Get("admin/:id")
  adminFindOne(@Param("id", ParseIntPipe) id: number) {
    return this.products.findOne(id);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles("ADMIN")
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles("ADMIN")
  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.products.update(id, dto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.products.remove(id);
  }
}
