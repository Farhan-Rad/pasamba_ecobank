import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async getPosts() {
    return this.prisma.post.findMany({
      include: {
        user: { select: { id: true, name: true, username: true, avatarUrl: true, level: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async createPost(userId: string, data: { content: string; imageUrl?: string }) {
    return this.prisma.post.create({
      data: { userId, content: data.content, imageUrl: data.imageUrl, badges: '[]' },
    });
  }

  async toggleLike(userId: string, postId: string) {
    const existing = await this.prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existing) {
      await this.prisma.like.delete({ where: { id: existing.id } });
      return { liked: false };
    }
    await this.prisma.like.create({ data: { postId, userId } });
    return { liked: true };
  }

  async getTrending() {
    const posts = await this.prisma.post.findMany({
      include: { _count: { select: { likes: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return posts
      .sort((a, b) => b._count.likes - a._count.likes)
      .slice(0, 5)
      .map((p) => ({ id: p.id, title: p.content.slice(0, 50), likes: p._count.likes }));
  }
}
