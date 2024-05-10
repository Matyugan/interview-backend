import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({
    description: 'refreshTokenId',
    required: true,
  })
  readonly refreshTokenId: string;
}
