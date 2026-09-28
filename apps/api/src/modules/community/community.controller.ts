import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { User } from '../../common/user.decorator';

@Controller('community')
@UseGuards(JwtAuthGuard)
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get('posts')
  getPosts() {
    return this.communityService.getPosts();
  }

  @Post('posts')
  createPost(@User('id') userId: string, @Body() data: { content: string; imageUrl?: string }) {
    return this.communityService.createPost(userId, data);
  }

  @Post('posts/:id/like')
  toggleLike(@User('id') userId: string, @Param('id') postId: string) {
    return this.communityService.toggleLike(userId, postId);
  }

  @Get('trending')
  getTrending() {
    return this.communityService.getTrending();
  }
}
