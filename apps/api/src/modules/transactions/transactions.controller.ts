import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { User } from '../../common/user.decorator';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  findAll(@User('id') userId: string, @Query() query: any) {
    return this.transactionsService.findAll(userId, query);
  }

  @Get('summary')
  summary(@User('id') userId: string) {
    return this.transactionsService.summary(userId);
  }
}
