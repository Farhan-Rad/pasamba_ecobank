import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class RewardsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.reward.findMany({ where: { isActive: true } });
  }

  async redeem(userId: string, rewardId: string) {
    const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward) throw new BadRequestException('Reward not found');
    if (reward.stock <= 0) throw new BadRequestException('Out of stock');

    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.points < reward.pointsCost) {
      throw new BadRequestException('Insufficient points');
    }

    await this.prisma.wallet.update({
      where: { userId },
      data: { points: { decrement: reward.pointsCost } },
    });
    await this.prisma.reward.update({
      where: { id: rewardId },
      data: { stock: { decrement: 1 } },
    });
    const redemption = await this.prisma.redemption.create({
      data: { userId, rewardId, pointsUsed: reward.pointsCost },
    });
    await this.prisma.transaction.create({
      data: {
        userId,
        amount: -reward.pointsCost,
        type: 'REDEEM',
        description: `Redeemed ${reward.name}`,
        category: 'redeem',
      },
    });
    return redemption;
  }

  async history(userId: string) {
    return this.prisma.redemption.findMany({
      where: { userId },
      include: { reward: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
