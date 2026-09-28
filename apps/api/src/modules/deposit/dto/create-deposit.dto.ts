import { IsNumber, IsString, IsPositive, Max, IsNotEmpty } from 'class-validator';

// Batas wajar per transaksi deposit tunggal. Sesuaikan dengan kapasitas
// mesin fisik ATM Sampah kalian (mis. kapasitas maksimum kompartemen).
const MAX_WEIGHT_KG = 50;

export class CreateDepositDto {
  @IsString()
  @IsNotEmpty()
  machineId!: string;

  @IsNumber()
  @IsPositive({ message: 'weight must be greater than 0' })
  @Max(MAX_WEIGHT_KG, { message: `weight exceeds maximum allowed (${MAX_WEIGHT_KG}kg)` })
  weight!: number;

  @IsString()
  @IsNotEmpty()
  wasteType!: string;
}
