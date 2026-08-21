import { credentials, DEPLOYMENT_STATUS, JWT_SECRET } from "../config/env"
import { findOrCreateOAuthUser, getGoogleAuthUrl, getGoogleProfile, getGoogleTokens, normalizeGoogleProfile } from "../services/auth/oAuth.service"
import {Request, Response} from "express"
import crypto from "crypto"
import { storeToken } from "../db/refreshTokenQueries"
import jwt from "jsonwebtoken"
export const googleLogin = (req:Request, res:Response) => {

    const url = getGoogleAuthUrl()
    res.redirect(url)
}

export const googleCallback = async (
  req: Request,
  res: Response
) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth?error=oauth_failed`
      );
    }

    const tokens = await getGoogleTokens(code);

    const googleProfile = await getGoogleProfile(
      tokens.access_token
    );

    const profile =
      normalizeGoogleProfile(googleProfile);

    const user = await findOrCreateOAuthUser(profile);

    const token = jwt.sign({id: user.id}, JWT_SECRET, { expiresIn: "45m" })
        const refreshToken = crypto.randomBytes(64).toString("hex")
        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex")

        try {
            const response = await storeToken(hashedToken, user.id)
        } catch (error) {
            console.log("not able to store referesh token in the database: ", error)
            return res.status(500).json({
                message:"refresh token query failed"
            })
        }

        res.cookie("token", token, {
            httpOnly:true,
            secure: DEPLOYMENT_STATUS == "production"?true:false,
            sameSite: "none"
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: DEPLOYMENT_STATUS == "production"?true:false,
            sameSite: "none"
        })

        console.log("OAuth user:", user);
        return res.redirect(`${credentials.FRONTEND_URL}/oauth/callback`)
        

  } catch (error) {
    console.error("Google OAuth error:", error);

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth?error=oauth_failed`
    );
  }
};