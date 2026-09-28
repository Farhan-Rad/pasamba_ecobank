import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

// Syarat pencairan saldo ke rekening BRI — ketiganya harus terpenuhi:
const MIN_ACCOUNT_AGE_MONTHS = 6;
const MIN_BALANCE = 50_000; // Rupiah
const MIN_CUMULATIVE_WEIGHT_KG = 17; // total akumulasi berat semua deposit user

// Untuk demo/testing prototipe: akun yang baru dibuat (seed hari ini) tidak
// mungkin lolos syarat umur 6 bulan secara alami. Set env
// WITHDRAWAL_BYPASS_ACCOUNT_AGE=true di file .env untuk melewati syarat ini
// SAAT DEMO/TESTING SAJA. JANGAN aktifkan flag ini di lingkungan produksi
// nanti setelah sistem live dengan user asli.
const BYPASS_ACCOUNT_AGE = process.env.WITHDRAWAL_BYPASS_ACCOUNT_AGE === 'true';

@Injectable()
export class WithdrawalService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, bankAccount: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });
    if (!user || !user.wallet) {
      throw new NotFoundException('User or wallet not found');
    }

    if (!BYPASS_ACCOUNT_AGE) {
      const ageInMonths =
        (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (ageInMonths < MIN_ACCOUNT_AGE_MONTHS) {
        throw new BadRequestException(
          `Akun harus berumur minimal ${MIN_ACCOUNT_AGE_MONTHS} bulan untuk menarik saldo`,
        );
      }
    }

    if (user.wallet.balance < MIN_BALANCE) {
      throw new BadRequestException(
        `Minimum saldo Rp${MIN_BALANCE.toLocaleString('id-ID')} diperlukan untuk mencairkan (saldo saat ini Rp${user.wallet.balance.toLocaleString('id-ID')})`,
      );
    }

    const { _sum } = await this.prisma.deposit.aggregate({
      where: { userId },
      _sum: { weight: true },
    });
    const totalWeight = _sum.weight ?? 0;

    if (totalWeight < MIN_CUMULATIVE_WEIGHT_KG) {
      throw new BadRequestException(
        `Minimum ${MIN_CUMULATIVE_WEIGHT_KG}kg total setor diperlukan untuk mencairkan saldo (baru ${totalWeight}kg)`,
      );
    }

    const amount = user.wallet.balance;

    // Saldo langsung ditahan (dikurangi ke 0) saat request dibuat, dan
    // pembuatan withdrawal + pengurangan saldo dibungkus $transaction agar
    // atomic — mencegah user request withdrawal berkali-kali untuk saldo
    // yang sama sebelum admin sempat approve/reject.
    const [withdrawal] = await this.prisma.$transaction([
      this.prisma.withdrawal.create({
        data: { userId, amount, bankAccount, status: 'PENDING' },
      }),
      this.prisma.wallet.update({
        where: { userId },
        data: { balance: { decrement: amount } },
      }),
    ]);

    return withdrawal;
  }

  async listMine(userId: string) {
    return this.prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listPending() {
    return this.prisma.withdrawal.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  // Admin menyetujui: untuk tahap prototipe ini murni menandai status
  // (simulasi). Belum ada transfer otomatis ke BRI di sini — itu baru
  // dipasang setelah akses API/CMS BRI resmi didapat dari pihak sekolah.
  async approve(withdrawalId: string) {
    const withdrawal = await this.findPendingOrThrow(withdrawalId);
    return this.prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: 'APPROVED', processedAt: new Date() },
    });
  }

  // Admin menolak: kembalikan saldo yang sempat ditahan ke wallet user.
  async reject(withdrawalId: string, reason?: string) {
    const withdrawal = await this.findPendingOrThrow(withdrawalId);

    const [updated] = await this.prisma.$transaction([
      this.prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: { status: 'REJECTED', processedAt: new Date(), adminNote: reason },
      }),
      this.prisma.wallet.update({
        where: { userId: withdrawal.userId },
        data: { balance: { increment: withdrawal.amount } },
      }),
    ]);

    return updated;
  }

  private async findPendingOrThrow(withdrawalId: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({ where: { id: withdrawalId } });
    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }
    if (withdrawal.status !== 'PENDING') {
      throw new BadRequestException(`Withdrawal already ${withdrawal.status.toLowerCase()}`);
    }
    return withdrawal;
  }
}
