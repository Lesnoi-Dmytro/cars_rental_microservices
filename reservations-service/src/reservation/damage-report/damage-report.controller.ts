import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, RequiredRole } from 'src/auth/auth.guard';
import type { JwtUser } from 'src/classes/auth/jwt_user.class';
import { MessageResponse } from 'src/classes/message-response.class';
import { InitiatePaymentResponse } from 'src/classes/payment/initiate-payment-response.class';
import { CreateDamageReport } from 'src/classes/reservations/damage-reports/create-damage-report.class';
import { DamageReportResponse } from 'src/classes/reservations/damage-reports/damage-report-response.class';
import { UpdateDamageReport } from 'src/classes/reservations/damage-reports/update-damage-report.class';
import { DamageReportService } from 'src/reservation/damage-report/damage-report.service';
import { Role } from 'src/utils/enums/role.esum';

@ApiTags('Damage Report')
@ApiBearerAuth()
@Controller('damage-report')
export class DamageReportController {
  constructor(private readonly damageReportService: DamageReportService) {}

  @ApiOperation({ summary: 'Get damage report by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Damage report id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Damage report',
    type: DamageReportResponse,
  })
  @Get('/:id')
  public async getReportById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') user: JwtUser,
  ) {
    const damageReport = await this.damageReportService.getReportById(id, user);

    return new DamageReportResponse(
      damageReport,
      damageReport.reporter,
      damageReport.photos,
    );
  }

  @ApiOperation({ summary: 'Create damage report' })
  @ApiBody({
    type: CreateDamageReport,
    description: 'Damage report',
  })
  @ApiParam({
    name: 'Authorization',
    required: false,
    description: '(Leave empty. Use lock icon on the top-right to authorize)',
  })
  @ApiResponse({
    status: 201,
    description: 'Damage report',
    type: DamageReportResponse,
  })
  @Post('/:id')
  public async createReport(
    @Body() data: CreateDamageReport,
    @CurrentUser('id') id: number,
    @Headers('Authorization') token: string,
  ) {
    const damageReport = await this.damageReportService.createReport(
      data,
      id,
      token,
    );

    return new DamageReportResponse(
      damageReport,
      damageReport.reporter,
      damageReport.photos,
    );
  }

  @ApiOperation({ summary: 'Initiate damage report payment' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Damage report id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Initiate payment response',
    type: InitiatePaymentResponse,
  })
  @Post('/:id/pay/initiate')
  public async initiateDamageReportPayment(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.damageReportService.initiatePayment(id);
  }

  @ApiOperation({ summary: 'Update damage report' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Damage report id',
    example: 1,
  })
  @ApiBody({
    type: UpdateDamageReport,
    description: 'Damage report',
  })
  @ApiResponse({
    status: 200,
    description: 'Damage report',
    type: DamageReportResponse,
  })
  @RequiredRole(Role.ADMIN)
  @Put('/:id')
  public async updateReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateDamageReport,
  ) {
    const damageReport = await this.damageReportService.updateReport(id, data);

    return new DamageReportResponse(
      damageReport,
      damageReport.reporter,
      damageReport.photos,
    );
  }

  @ApiOperation({ summary: 'Delete damage report' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Damage report id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Delete result',
    type: MessageResponse,
  })
  @RequiredRole(Role.ADMIN)
  @Delete('/:id')
  public async deleteReport(@Param('id', ParseIntPipe) id: number) {
    return this.damageReportService.deleteReport(id);
  }
}
