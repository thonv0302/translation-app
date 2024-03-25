import { OAuth2Client } from 'google-auth-library';
import { zh, z } from 'h3-zod';

const {
  auth: { googleClientId, googleClientSecret },
} = useRuntimeConfig();
const authClient = new OAuth2Client(googleClientId, googleClientSecret);
export default defineEventHandler(async (event) => {
  const { db } = event.context;

  const body = await zh.useValidatedBody(event, {
    token: z.string(),
  });
  const loginTicket = await authClient.verifyIdToken({
    idToken: body.token,
  });

  const { email, sub: googleId } = loginTicket.getPayload() as any;
  const user = await db.user.findFirstOrThrow({
    where: {
      googleId: googleId,
    },
  });

  if (user) {
    //generate token
  } else {
    // Create new user and generate token
  }
});
