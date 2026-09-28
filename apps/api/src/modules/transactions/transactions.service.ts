import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: any) {
    const where: any = { userId };
    if (query.type) where.type = query.type;
    if (query.category) where.category = query.category;
    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return transactions;
  }

  async summary(userId: string) {
    const transactions = await this.prisma.transaction.findMany({ where: { userId } });
    const totalEarned = transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalSpent = transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { totalEarned, totalSpent, net: totalEarned - totalSpent, count: transactions.length };
  }
}
