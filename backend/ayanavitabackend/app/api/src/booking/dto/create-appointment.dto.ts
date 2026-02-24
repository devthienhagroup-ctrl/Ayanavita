import { IsEmail, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class CreateAppointmentDto {
  @IsString()
  @MaxLength(255)
  customerName!: string

  @IsString()
  @MaxLength(30)
  customerPhone!: string

  @IsOptional()
  @IsEmail()
  customerEmail?: string

  @IsString()
  appointmentAt!: string

  @IsOptional()
  @IsString()
  note?: string

  @IsInt()
  @Min(1)
  branchId!: number

  @IsInt()
  @Min(1)
  serviceId!: number

  @IsOptional()
  @IsInt()
  @Min(1)
  specialistId?: number

  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number
}
