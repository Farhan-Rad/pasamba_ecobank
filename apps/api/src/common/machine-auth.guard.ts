import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Memverifikasi bahwa request benar-benar berasal dari mesin ATM Sampah
 * yang terdaftar, lewat header `x-machine-key`. Ini mencegah endpoint
 * deposit dipanggil langsung oleh user (tanpa mesin) untuk mendapat
 * saldo palsu.
 *
 * Menempelkan mesin yang tervalidasi ke `request.machine`, supaya
 * controller/service tidak perlu query ulang.
 */
@Injectable()
export class MachineAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const machineKey = request.headers['x-machine-key'];

    if (!machineKey || typeof machineKey !== 'string') {
      throw new UnauthorizedException('Machine API key is required');
    }

    const machine = await this.prisma.machine.findUnique({
      where: { apiKey: machineKey },
    });

    if (!machine) {
      throw new UnauthorizedException('Invalid machine API key');
    }

    if (machine.status === 'DISABLED') {
      throw new UnauthorizedException('Machine is disabled');
    }

    request.machine = machine;
    return true;
  }
}
