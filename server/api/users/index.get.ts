import { zh, z } from 'h3-zod';
import _ from 'lodash';

export default defineEventHandler(async (event) => {
  try {
    const { db } = event.context;

    const users = await db.user.findMany();

    return {
      users,
    };
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ERROR',
    });
  }
});
