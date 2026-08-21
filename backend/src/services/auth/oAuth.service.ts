import axios from "axios";
import { prisma } from "../../db/db";

type OAuthProvider = "GOOGLE" | "GITHUB";

export interface OAuthProfile {
  provider: OAuthProvider;
  providerAccountId: string;
  email: string;
  name: string;
  avatar?: string;
}

export const getGoogleAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
};

export const getGithubAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: process.env.GITHUB_CALLBACK_URL!,
    scope: "read:user user:email",
  });

  return `https://github.com/login/oauth/authorize?${params}`;
};

export const getGoogleTokens = async (code: string) => {
  const response = await axios.post(
    "https://oauth2.googleapis.com/token",
    {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      grant_type: "authorization_code",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const getGithubToken = async (
  code: string
) => {
  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return response.data;
};



export const getGoogleProfile = async (accessToken: string) => {
  const response = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

export const getGithubProfile = async (
  accessToken: string
) => {
  const response = await axios.get(
    "https://api.github.com/user",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  return response.data;
};

export const getGithubEmails = async (
  accessToken: string
) => {
  const response = await axios.get(
    "https://api.github.com/user/emails",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  return response.data;
};

export const normalizeGoogleProfile = (
  profile: any
): OAuthProfile => {
  if (!profile.email) {
    throw new Error("Google account does not have an email");
  }

  if (!profile.email_verified) {
    throw new Error("Google email is not verified");
  }

  return {
    provider: "GOOGLE",
    providerAccountId: profile.sub,
    email: profile.email,
    name: profile.name,
    avatar: profile.picture,
  };
};


export const findOrCreateOAuthUser = async (
  profile: OAuthProfile
) => {
  const existingAccount =
    await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: profile.provider,
          providerAccountId: profile.providerAccountId,
        },
      },
      include: {
        user: true,
      },
    });

  if (existingAccount) {
    return existingAccount.user;
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: profile.email,
    },
  });

  if (existingUser) {
    await prisma.oAuthAccount.create({
      data: {
        provider: profile.provider,
        providerAccountId: profile.providerAccountId,
        userId: existingUser.id,
      },
    });

    return existingUser;
  }

  const user = await prisma.user.create({
    data: {
      email: profile.email,
      name: profile.name,
      ...(profile.avatar && {avatar: profile.avatar}),

      oauthAccounts: {
        create: {
          provider: profile.provider,
          providerAccountId: profile.providerAccountId,
        },
      },
    },
  });

  return user;
};