import { zh, z } from 'h3-zod';
import bcrypt from 'bcrypt';

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
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      passwordConfirm: z.string().min(6),
    });

    if (body.password !== body.passwordConfirm) {
      throw new Error('Passwords do not match.');
    }

    const passwordHash: string = await bcrypt.hash(body.password, 10);

    const user = await db.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: passwordHash,
      },
    });
    return user;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Register failed',
    });
    // console.log('error: ', error);
    // return {
    //   data: null,
    //   error: (error as Error).message,
    // };
  }
});
