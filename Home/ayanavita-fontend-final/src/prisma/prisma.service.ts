// src/prisma/prisma.service.ts
import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client/extension";

/**
 * PrismaService
 * - Extend PrismaClient để các model (prisma.blogPost, prisma.user, ...) có type đầy đủ
 * - Kết nối DB ở onModuleInit
 * - Shutdown hook theo Prisma v6: dùng SIGTERM/SIGINT (không dùng beforeExit)
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private shutdownHookEnabled = false;

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Prisma v6 shutdown hook (KHÔNG dùng beforeExit nữa)
   * - Giữ đúng theo file cũ bạn đang dùng: SIGTERM + SIGINT
   * - Bổ sung "idempotent" để tránh add listener nhiều lần khi dev hot-reload
   */
  async enableShutdownHooks(app: INestApplication) {
    if (this.shutdownHookEnabled) return;
    this.shutdownHookEnabled = true;

    const onShutdown = async (signal: NodeJS.Signals) => {
      try {
        // Đóng Nest app (sẽ gọi onModuleDestroy/close nếu có)
        await app.close();
      } catch (err) {
        // Tránh crash khi shutdown
        // eslint-disable-next-line no-console
        console.error(`[PrismaService] Error on ${signal} shutdown:`, err);
      } finally {
        // đảm bảo exit đúng (nếu app còn treo)
        process.exit(0);
      }
    };

    // Đăng ký listener
    process.once("SIGTERM", () => void onShutdown("SIGTERM"));
    process.once("SIGINT", () => void onShutdown("SIGINT"));
  }
}
