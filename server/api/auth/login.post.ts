import { zh, z } from 'h3-zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

export default defineEventHandler(async (event) => {
  try {
    const {
      auth: { jwtTokenSecret, jwtTokenExpirySeconds },
      public: {
        auth: { authCookieName },
      },
    } = useRuntimeConfig();
    const { db } = event.context;

    const body = await zh.useValidatedBody(event, {
      email: z.string().email(),
      password: z.string(),
    });

    const user = await db.user.findFirstOrThrow({
      where: {
        email: body.email,
      },
    });

    const isMatch = bcrypt.compare(body.password, user.password);

    if (!isMatch) {
      throw new Error('Invalid account details');
    }

    const userExcludePassword = _.omit(user, ['password']);
    const accessToken = jwt.sign(userExcludePassword, jwtTokenSecret, {
      expiresIn: jwtTokenExpirySeconds,
    });

    // const refresh

    // console.log('body: ', body);
    return {
      accessToken,
      user: userExcludePassword,
    };
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message,
    };
  }
});
