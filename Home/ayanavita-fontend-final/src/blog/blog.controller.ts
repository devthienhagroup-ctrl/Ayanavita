import {
  Controller, Get, Param, Query, Post, Patch, Delete, Body, Req,
  UseGuards
} from "@nestjs/common";
import { BlogService } from "./blog.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard"; // theo chuẩn AYANAVITA
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CreatePostDto, UpdatePostDto } from "./dto";

@UseGuards(JwtAuthGuard)
@Controller("blog")
export class BlogController {
  constructor(private readonly blog: BlogService) {}

  @Get("posts")
  list(
    @Query("q") q?: string,
    @Query("tag") tag?: string,
    @Query("sort") sort: "new" | "popular" = "new",
    @Query("page") page = "1",
    @Query("pageSize") pageSize = "12",
  ) {
    return this.blog.list({ q, tag, sort, page: +page, pageSize: +pageSize });
  }

  @Get("posts/:slug")
  detail(@Param("slug") slug: string) {
    return this.blog.detailBySlug(slug);
  }

  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  @Post("posts")
  create(@Body() dto: CreatePostDto) {
    return this.blog.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  @Patch("posts/:id")
  update(@Param("id") id: string, @Body() dto: UpdatePostDto) {
    return this.blog.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  @Delete("posts/:id")
  remove(@Param("id") id: string) {
    return this.blog.remove(id);
  }

  @Post("posts/:id/view")
  view(@Param("id") id: string) {
    return this.blog.incView(id);
  }

  // Saved
  @Get("saved")
  saved(@Req() req: any) {
    return this.blog.getSaved(req.user.id);
  }

  @Post("saved/:postId")
  save(@Req() req: any, @Param("postId") postId: string) {
    return this.blog.save(req.user.id, postId);
  }

  @Delete("saved/:postId")
  unsave(@Req() req: any, @Param("postId") postId: string) {
    return this.blog.unsave(req.user.id, postId);
  }

  @Delete("saved")
  clearSaved(@Req() req: any) {
    return this.blog.clearSaved(req.user.id);
  }
}
