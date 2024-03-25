import { zh, z } from 'h3-zod';
import { randomUUID } from 'crypto';
import _ from 'lodash';
import { format } from 'date-fns';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  try {
    const {
      auth: {
        jwtTokenSecret,
        jwtTokenExpirySeconds,
        jwtRefreshTokenExpirySeconds,
      },
    } = useRuntimeConfig();

    const { db } = event.context;
    const uuid = randomUUID();
    const body = await zh.useValidatedBody(event, {
      refreshToken: z.string(),
    });

    const verified: any = jwt.verify(body.refreshToken, jwtTokenSecret);

    const data: any = await useStorage('cache').getItem(
      `nitro:functions:refreshToken:user-${verified.userId}.json`
    );

    if (!data) {
      await cachedRefreshToken(`user-${verified.userId}`, uuid);
    }

    if (verified.refreshTokenId !== data.value) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Refresh token invalid',
      });
    }

    const user = await db.user.findFirstOrThrow({
      where: {
        id: verified.userId,
      },
    });

    await cachedRefreshToken(`user-${user.id}`, uuid);
    const userExcludePassword = _.omit(user, ['password']);

    const [accessToken, refreshToken] = await Promise.all([
      jwt.sign(userExcludePassword, jwtTokenSecret, {
        expiresIn: jwtTokenExpirySeconds,
      }),
      jwt.sign({ userId: user.id, refreshTokenId: uuid }, jwtTokenSecret, {
        expiresIn: jwtRefreshTokenExpirySeconds,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      user: userExcludePassword,
    };
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message,
    };
  }
});
