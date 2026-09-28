import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { Machine } from '@prisma/client';

interface DepositInput {
  machineId: string;
  weight: number;
  wasteType: string;
}

// Untuk tahap prototipe ini, sistem baru menerima SATU jenis sampah:
// botol plastik (PET bening). Tarif mengikuti referensi harga bank sampah
// (Rp3.000/kg untuk PET bening) — sesuaikan angka ini kalau nanti sudah
// ada data harga resmi dari sekolah/dinas terkait.
const ACCEPTED_WASTE_TYPE = 'plastic-bottle';
const RATE_PER_KG = 3000; // Rupiah per kg

// Poin loyalty (dipakai untuk redeem reward) sengaja dipisah dari saldo
// uang — tetap pakai skala lama supaya sistem reward yang sudah ada tidak
// perlu diubah.
const POINTS_PER_KG = 100;

@Injectable()
export class DepositService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: DepositInput, machine: Machine) {
    // Pastikan mesin yang mengautentikasi request (via API key) adalah
    // mesin yang sama dengan machineId di body — mencegah satu mesin
    // "mengaku" jadi mesin lain.
    if (machine.id !== data.machineId) {
      throw new BadRequestException('machineId does not match authenticated machine');
    }

    // Untuk tahap ini, hanya botol plastik yang diterima — jenis lain
    // ditolak, apapun konfigurasi acceptedTypes mesin.
    if (data.wasteType !== ACCEPTED_WASTE_TYPE) {
      throw new BadRequestException(
        `Only "${ACCEPTED_WASTE_TYPE}" is accepted at this stage (got "${data.wasteType}")`,
      );
    }

    // Pastikan mesin memang dikonfigurasi untuk terima jenis ini juga.
    const acceptedTypes: string[] = JSON.parse(machine.acceptedTypes || '[]');
    if (acceptedTypes.length > 0 && !acceptedTypes.includes(data.wasteType)) {
      throw new BadRequestException(
        `Machine does not accept waste type "${data.wasteType}"`,
      );
    }

    const rupiah = Math.floor(data.weight * RATE_PER_KG);
    const points = Math.floor(data.weight * POINTS_PER_KG);

    // Semua operasi dibungkus $transaction: kalau salah satu gagal,
    // semuanya dibatalkan (atomic) — tidak ada state saldo yang tanggung.
    const [deposit] = await this.prisma.$transaction([
      this.prisma.deposit.create({
        data: {
          userId,
          machineId: data.machineId,
          weight: data.weight,
          wasteType: data.wasteType,
          points,
          images: '[]',
        },
      }),
      this.prisma.wallet.update({
        where: { userId },
        data: { balance: { increment: rupiah }, points: { increment: points } },
      }),
      this.prisma.transaction.create({
        data: {
          userId,
          amount: rupiah,
          type: 'DEPOSIT',
          description: `Recycled ${data.weight}kg of ${data.wasteType}`,
          category: data.wasteType,
          metadata: JSON.stringify({ machineId: data.machineId, weight: data.weight }),
        },
      }),
    ]);

    return deposit;
  }
}
