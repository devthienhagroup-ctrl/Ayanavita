import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { BookingService } from './booking.service'
import { BookingFilterQueryDto } from './dto/booking-query.dto'
import { CreateAppointmentDto } from './dto/create-appointment.dto'

@Controller('booking')
export class BookingController {
  constructor(private readonly booking: BookingService) {}

  @Get('services-page')
  servicesPage() {
    return this.booking.listServicesCatalog()
  }

  @Post('images/temp')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadTempImage(@UploadedFile() file?: any) {
    if (!file) throw new BadRequestException('file is required')
    return this.booking.saveTempImage(file)
  }

  @Delete('images/temp/:fileName')
  deleteTempImage(@Param('fileName') fileName: string) {
    return this.booking.deleteTempImage(fileName)
  }

  @Get('branches')
  branches() {
    return this.booking.listBranches()
  }

  @Get('services')
  services(@Query() query: BookingFilterQueryDto) {
    return this.booking.listServices(query.branchId)
  }

  @Get('specialists')
  specialists(@Query() query: BookingFilterQueryDto) {
    return this.booking.listSpecialists(query.branchId, query.serviceId)
  }

  @Get('appointments')
  appointments(@Query() query: BookingFilterQueryDto) {
    return this.booking.listAppointments(query.userId)
  }

  @Get('service-reviews')
  serviceReviews(@Query() query: BookingFilterQueryDto) {
    return this.booking.listServiceReviews(query.serviceId)
  }

  @Post('appointments')
  createAppointment(@Body() dto: CreateAppointmentDto) {
    return this.booking.createAppointment(dto)
  }
}
