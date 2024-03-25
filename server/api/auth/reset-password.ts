import { zh, z } from 'h3-zod';
import crypto from 'crypto';
import { formatISO } from 'date-fns';
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  try {
    const { db } = event.context;

    const body = await zh.useValidatedBody(event, {
      password: z.string().min(6),
      passwordConfirm: z.string().min(6),
      resetToken: z.string(),
    });

    if (body.password !== body.passwordConfirm) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Failed.',
      });
    }

    const user = await db.user.findFirstOrThrow({
      where: {
        resetToken: body.resetToken,
        tokenExpiry: {
          lte: formatISO(Date.now()),
        },
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Email not found',
      });
    }

    const passwordHash: string = await bcrypt.hash(body.password, 10);
    await db.user.update({
      where: {
        email: user.email,
      },
      data: {
        password: passwordHash,
        resetToken: null,
        tokenExpiry: null,
      },
    });

    return {
      statusCode: 201,
      statusMessage: 'Change password successfully.',
    };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Email not found',
    });
  }
});
