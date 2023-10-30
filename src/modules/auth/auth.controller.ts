import { TokenService } from '@/modules/token/token.service';
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '@/modules/user/dto/createUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthDto } from '@/modules/auth/dto/auth.dto';
import { Response as IResponse, Request as IRequest } from 'express';
import { ICreatedUser } from '@/modules/user/types/createdUser.interface';
import { ConfigService } from '@nestjs/config';
import { AccessTokenGuard } from '@/common/guards/accessToken.guard';
import { RefreshTokenGuard } from '@/common/guards/refreshToken.guard';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: IResponse,
  ): Promise<ICreatedUser> {
    const userData = await this.authService.signUp(createUserDto);

    response.cookie('refreshTokenId', userData.refreshTokenId, {
      httpOnly: true,
      // Время жизни эквивалентно времени жизни refresh токена
      maxAge: Number(
        this.configService.get<string>('EXPIRE_TIME_SECONDS_4_REFRESH_TOKEN'),
      ),
    });

    delete userData.refreshTokenId;
    return userData;
  }

  @Post('signin')
  async signIn(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) response: IResponse,
  ) {
    const result = await this.authService.signIn(authDto);

    response.cookie('refreshTokenId', result.refreshTokenId, {
      httpOnly: true,
      // Время жизни эквивалентно времени жизни refresh токена
      maxAge: Number(
        this.configService.get<string>('EXPIRE_TIME_SECONDS_4_REFRESH_TOKEN'),
      ),
    });

    return { accessToken: result.accessToken };
  }

  @UseGuards(AccessTokenGuard, RefreshTokenGuard)
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() request: IRequest,
    @Res({ passthrough: true }) response: IResponse,
  ) {
    const result = await this.authService.logout(
      request.cookies['refreshTokenId'],
    );

    if (!result.affected) {
      throw new ConflictException(
        'Refresh token не был удалён, по причине отсутствия в базе',
      );
    }

    response.clearCookie('refreshTokenId');
    return;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refreshing-tokens')
  async refresh(
    @Req() request: IRequest,
    @Res({ passthrough: true }) response: IResponse,
  ) {
    const tokens = await this.tokenService.updateTokens(
      request.cookies.refreshTokenId,
    );

    response.cookie('refreshTokenId', tokens.refreshTokenId, {
      httpOnly: true,
      // Время жизни эквивалентно времени жизни refresh токена
      maxAge: Number(
        this.configService.get<string>('EXPIRE_TIME_SECONDS_4_REFRESH_TOKEN'),
      ),
    });

    return {
      accessToken: tokens.accessToken,
    };
  }
}
