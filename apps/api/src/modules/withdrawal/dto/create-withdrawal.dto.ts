import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateWithdrawalDto {
  // Nomor rekening BRI tujuan. Validasi sederhana: hanya digit, 10-15 angka
  // (nomor rekening BRI umumnya 15 digit, tapi dibuat sedikit fleksibel
  // untuk mengakomodasi rekening SimPel/format lain).
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10,15}$/, { message: 'bankAccount must be 10-15 digits' })
  bankAccount!: string;
}
