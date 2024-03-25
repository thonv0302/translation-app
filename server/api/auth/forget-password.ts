import { zh, z } from 'h3-zod';
import crypto from 'crypto';
import { formatISO } from 'date-fns';

export default defineEventHandler(async (event) => {
  try {
    const { db } = event.context;

    const body = await zh.useValidatedBody(event, {
      email: z.string().email(),
    });

    const user = await db.user.findFirstOrThrow({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Email not found',
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    console.log('resetToken: ', resetToken);

    const tokenExpiry = Date.now() + 3600;
    const resetLink = `http://localhost:3000/auth/reset-password/${resetToken}`;

    await db.user.update({
      where: {
        email: body.email,
      },
      data: {
        resetToken,
        tokenExpiry: formatISO(tokenExpiry),
      },
    });

    await sendEmail({
      to: body.email,
      subject: 'Reset password account in translator app',
      text: 'Plaintext version of the message',
      html: `<a href="${resetLink}">Click here to reset your password account</a>`,
    });
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Email not found',
    });
  }
});
