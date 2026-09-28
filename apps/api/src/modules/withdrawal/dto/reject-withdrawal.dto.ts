import { IsString, IsOptional } from 'class-validator';

export class RejectWithdrawalDto {
  @IsString()
  @IsOptional()
  reason?: string;
}
