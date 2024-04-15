import { zh, z } from 'h3-zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { randomUUID } from 'crypto';

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
      email: z.string().email(),
      password: z.string(),
    });

    const user = await db.user.findFirstOrThrow({
      where: {
        email: body.email,
      },
    });

    const isMatch = await bcrypt.compare(body.password, user.password);

    if (!isMatch) {
      throw new Error('Invalid account details');
    }

    const data: any = await useStorage('cache').getItem(
      `nitro:functions:refreshToken:user-${user.id}.json`
    );

    if (!data) {
      await cachedRefreshToken(`user-${user.id}`, uuid);
    }

    console.log('user: ', user);

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
    // return {
    //   data: null,
    //   error: (error as Error).message,
    // };
    throw createError({
      statusCode: 500,
      statusMessage: 'Login failed',
    });
  }
});
