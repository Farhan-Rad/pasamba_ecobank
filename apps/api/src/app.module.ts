import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { MachinesModule } from './modules/machines/machines.module';
import { DepositModule } from './modules/deposit/deposit.module';
import { CommunityModule } from './modules/community/community.module';
import { RewardsModule } from './modules/rewards/rewards.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { FriendsModule } from './modules/friends/friends.module';
import { AdminModule } from './modules/admin/admin.module';
import { WithdrawalModule } from './modules/withdrawal/withdrawal.module';
import { SocketGateway } from './gateway/socket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    WalletModule,
    TransactionsModule,
    MachinesModule,
    DepositModule,
    CommunityModule,
    RewardsModule,
    AchievementsModule,
    UploadsModule,
    NotificationsModule,
    FriendsModule,
    AdminModule,
    WithdrawalModule,
  ],
  providers: [SocketGateway],
})
export class AppModule {}
