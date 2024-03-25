const {
  auth: { jwtRefreshTokenExpirySeconds },
} = useRuntimeConfig();
export const cachedRefreshToken = defineCachedFunction(
  async (refreshTokenId: string, repo: string) => {
    return repo;
  },
  {
    maxAge: jwtRefreshTokenExpirySeconds,
    name: 'refreshToken',
    getKey: (repo: string) => repo,
  }
);
