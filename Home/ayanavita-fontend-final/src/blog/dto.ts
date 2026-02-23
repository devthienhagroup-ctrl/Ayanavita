import { IsEnum, IsOptional, IsString } from "class-validator";

enum BlogTag {
  skincare = "skincare",
  massage = "massage",
  wellness = "wellness",
  franchise = "franchise",
}

export class CreatePostDto {
  @IsString() slug!: string;
  @IsString() title!: string;

  @IsEnum(BlogTag) tag!: BlogTag;

  @IsString() authorName!: string;
  @IsString() contentMd!: string;

  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() publishedAt?: string; // ISO
}

export class UpdatePostDto {
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsEnum(BlogTag) tag?: BlogTag;
  @IsOptional() @IsString() authorName?: string;
  @IsOptional() @IsString() contentMd?: string;

  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() publishedAt?: string | null; // null = unpublish
}
