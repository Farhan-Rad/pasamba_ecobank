import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [users, machines, transactions, deposits] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.machine.count(),
      this.prisma.transaction.count(),
      this.prisma.deposit.aggregate({ _sum: { weight: true } }),
    ]);
    return { totalUsers: users, totalMachines: machines, totalTransactions: transactions, totalWeight: deposits._sum.weight || 0 };
  }
}
