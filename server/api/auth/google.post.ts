import { OAuth2Client } from 'google-auth-library';
import { zh, z } from 'h3-zod';
import _ from 'lodash';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const {
    auth: {
      jwtTokenSecret,
      jwtTokenExpirySeconds,
      jwtRefreshTokenExpirySeconds,
      googleClientId,
      googleClientSecret,
    },
  } = useRuntimeConfig();
  const authClient = new OAuth2Client(googleClientId, googleClientSecret);
  const { db } = event.context;
  const uuid = randomUUID();

  const body = await zh.useValidatedBody(event, {
    token: z.string(),
  });

  const loginTicket = await authClient.verifyIdToken({
    idToken: body.token,
  });

  const { email, sub: googleId, name } = loginTicket.getPayload() as any;

  const userFound = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  let user: any;
  if (userFound) {
    await db.user.update({
      where: {
        email: email,
      },
      data: {
        googleId: googleId,
      },
    });
    user = _.omit(userFound, ['password']);
  } else {
    user = await db.user.create({
      data: {
        name: name,
        email: email,
        googleId: googleId,
      },
    });
  }
  const data: any = await useStorage('cache').getItem(
    `nitro:functions:refreshToken:user-${user.id}.json`
  );

  if (!data) {
    await cachedRefreshToken(`user-${user.id}`, uuid);
  }

  const [accessToken, refreshToken] = await Promise.all([
    jwt.sign(user, jwtTokenSecret, {
      expiresIn: jwtTokenExpirySeconds,
    }),
    jwt.sign({ userId: user.id, refreshTokenId: uuid }, jwtTokenSecret, {
      expiresIn: jwtRefreshTokenExpirySeconds,
    }),
  ]);

  return {
    accessToken,
    refreshToken,
    user,
  };
});
