import jwt from 'jsonwebtoken';
import _ from 'lodash';

/**
 * Make the user globally available within event handlers
 * if the authentication token is passed along.
 */
export default defineEventHandler(async (event) => {
  const {
    auth: { jwtTokenSecret },
  } = useRuntimeConfig();
  console.log(
    ' getRequestURL(event).pathname: ',
    getRequestURL(event).pathname
  );

  // if (
  //   getRequestURL(event).pathname.startsWith('/api/auth') ||
  //   getRequestURL(event).pathname.startsWith('/auth/login') ||
  //   getRequestURL(event).pathname.startsWith('/auth/register') ||
  //   getRequestURL(event).pathname.startsWith('/auth/reset-password') ||
  //   getRequestURL(event).pathname.startsWith('/auth/forgot-password')
  //   getRequestURL(event).pathname.startsWith('/auth')
  // ) {
  //   return;
  // }

  // const { db } = event.context;

  // const [_, accessToken] = event.req.headers['authorization']?.split(' ') || [];
  // if (!accessToken) {
  //   throw createError({
  //     statusCode: 401,
  //     statusMessage: 'Unauthorized',
  //   });
  // }

  // try {
  //   const verified: any = jwt.verify(accessToken, jwtTokenSecret);
  //   const user = await db.user.findFirstOrThrow({
  //     where: {
  //       id: verified.id,
  //     },
  //   });

  //   event.context.user = user;
  // } catch (error: any) {
  //   if (error.message === 'jwt expired') {
  //     throw createError({
  //       statusCode: 401,
  //       statusMessage: 'Unauthorized',
  //     });
  //   }
  // }
});
