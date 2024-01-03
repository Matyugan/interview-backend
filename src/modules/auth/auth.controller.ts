import { TokenService } from '@/modules/token/token.service';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  HttpStatus,
  Get,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '@/modules/user/dto/createUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthDto } from '@/modules/auth/dto/auth.dto';
import { Response as IResponse, Request as IRequest } from 'express';
import { ICreatedUser } from '@/modules/user/types/createdUser.interface';
import { AccessTokenGuard } from '@/common/guards/accessToken.guard';
import SerializedUser from '@/modules/user/serialization/serializedUser';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: IResponse,
  ): Promise<Omit<ICreatedUser, 'refreshToken'>> {
    const createdUserData = await this.authService.signUp(createUserDto);

    response.cookie('refreshTokenId', createdUserData.refreshToken.id, {
      httpOnly: true,
      maxAge: Number(createdUserData.refreshToken.expireTime),
    });

    return new SerializedUser(createdUserData);
  }

  @Post('signin')
  async signIn(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) response: IResponse,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      authDto,
    );

    response.cookie('refreshTokenId', refreshToken.id, {
      httpOnly: true,
      maxAge: Number(refreshToken.expireTime),
    });

    return { accessToken };
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res({ passthrough: true }) response: IResponse) {
    response.clearCookie('refreshTokenId');
    return;
  }

  @Get('refreshing-tokens')
  async refresh(
    @Req() request: IRequest,
    @Res({ passthrough: true }) response: IResponse,
  ) {
    const { accessToken, refreshToken } = await this.tokenService.updateTokens(
      request.cookies.refreshTokenId,
    );

    response.cookie('refreshTokenId', refreshToken.id, {
      httpOnly: true,
      maxAge: Number(refreshToken.expireTime),
    });

    return {
      accessToken,
    };
  }
}
