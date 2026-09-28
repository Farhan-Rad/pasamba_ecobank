import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { MachineAuthGuard } from '../../common/machine-auth.guard';
import { User } from '../../common/user.decorator';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Controller('deposit')
// Kedua guard harus lolos: JwtAuthGuard membuktikan ADA user yang login
// (mis. login/scan QR di layar mesin), MachineAuthGuard membuktikan
// request ini benar datang dari mesin terdaftar (via x-machine-key).
// Tanpa keduanya, endpoint ini bisa dipanggil langsung oleh siapa saja
// yang punya token user untuk mendapat saldo palsu.
@UseGuards(JwtAuthGuard, MachineAuthGuard)
export class DepositController {
  constructor(private depositService: DepositService) {}

  @Post()
  create(@User('id') userId: string, @Body() data: CreateDepositDto, @Req() req: any) {
    // req.machine ditempel oleh MachineAuthGuard setelah verifikasi key
    return this.depositService.create(userId, data, req.machine);
  }
}
