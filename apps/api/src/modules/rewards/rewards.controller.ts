import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { User } from '../../common/user.decorator';

@Controller('rewards')
@UseGuards(JwtAuthGuard)
export class RewardsController {
  constructor(private rewardsService: RewardsService) {}

  @Get()
  findAll() {
    return this.rewardsService.findAll();
  }

  @Post(':id/redeem')
  redeem(@User('id') userId: string, @Param('id') rewardId: string) {
    return this.rewardsService.redeem(userId, rewardId);
  }

  @Get('history')
  history(@User('id') userId: string) {
    return this.rewardsService.history(userId);
  }
}
