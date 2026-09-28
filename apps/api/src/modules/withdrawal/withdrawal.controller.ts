import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { AdminGuard } from '../../common/admin.guard';
import { User } from '../../common/user.decorator';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { RejectWithdrawalDto } from './dto/reject-withdrawal.dto';

@Controller('withdrawal')
@UseGuards(JwtAuthGuard)
export class WithdrawalController {
  constructor(private withdrawalService: WithdrawalService) {}

  @Post()
  create(@User('id') userId: string, @Body() body: CreateWithdrawalDto) {
    return this.withdrawalService.create(userId, body.bankAccount);
  }

  @Get()
  listMine(@User('id') userId: string) {
    return this.withdrawalService.listMine(userId);
  }

  // --- Endpoint admin, butuh role ADMIN (lihat AdminGuard) ---

  @Get('admin/pending')
  @UseGuards(AdminGuard)
  listPending() {
    return this.withdrawalService.listPending();
  }

  @Patch('admin/:id/approve')
  @UseGuards(AdminGuard)
  approve(@Param('id') id: string) {
    return this.withdrawalService.approve(id);
  }

  @Patch('admin/:id/reject')
  @UseGuards(AdminGuard)
  reject(@Param('id') id: string, @Body() body: RejectWithdrawalDto) {
    return this.withdrawalService.reject(id, body.reason);
  }
}
