import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { User } from '../../common/user.decorator';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Get()
  getFriends(@User('id') userId: string) {
    return this.friendsService.getFriends(userId);
  }

  @Get('requests')
  getRequests(@User('id') userId: string) {
    return this.friendsService.getPendingRequests(userId);
  }

  @Get('suggestions')
  getSuggestions(@User('id') userId: string) {
    return this.friendsService.getSuggestions(userId);
  }

  @Post('request/:userId')
  sendRequest(@User('id') userId: string, @Param('userId') targetUserId: string) {
    return this.friendsService.sendRequest(userId, targetUserId);
  }

  @Post('accept/:requestId')
  acceptRequest(@User('id') userId: string, @Param('requestId') requestId: string) {
    return this.friendsService.acceptRequest(userId, requestId);
  }

  @Post('reject/:requestId')
  rejectRequest(@User('id') userId: string, @Param('requestId') requestId: string) {
    return this.friendsService.rejectRequest(userId, requestId);
  }
}
