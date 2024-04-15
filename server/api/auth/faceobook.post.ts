import { zh, z } from 'h3-zod';
import _ from 'lodash';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const {
    auth: {
      facebookAppId,
      facebookAppSecret,
      jwtTokenSecret,
      jwtTokenExpirySeconds,
      jwtRefreshTokenExpirySeconds,
    },
  } = useRuntimeConfig();
  const { db } = event.context;
  const uuid = randomUUID();

  const body = await zh.useValidatedBody(event, {
    accessToken: z.string(),
  });

  const verificationUrl = `https://graph.facebook.com/debug_token?input_token=${body.accessToken}&access_token=${facebookAppId}|${facebookAppSecret}`;

  const response: any = await $fetch(verificationUrl, {
    method: 'GET',
  });

  if (
    response.data &&
    response.data.is_valid &&
    response.data.app_id === facebookAppId
  ) {
    // Token is valid and was issued by our app, now fetch user information
    const userInfoUrl = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${body.accessToken}`;
    const {
      email,
      id: facebookId,
      name,
    } = (await $fetch(userInfoUrl, {
      method: 'GET',
    })) as any;
    // console.log('userInfoResponse: ', userInfoResponse);

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
          facebookId: facebookId,
        },
      });
      user = _.omit(userFound, ['password']);
    } else {
      user = await db.user.create({
        data: {
          name: name,
          email: email,
          facebookId: facebookId,
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

    // Now you have the user's information, you can proceed with your application logic
  } else {
    // Token is not valid
  }

  try {
  } catch (error) {
    console.log('error: ', error);
  }
});
