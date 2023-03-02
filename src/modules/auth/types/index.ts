export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
}
