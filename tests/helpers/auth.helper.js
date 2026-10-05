import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../server/models/user.model.js";

/**
 * Creates a user directly in the database with properly hashed password.
 */
export async function createTestUser(overrides = {}) {
    const defaultUser = {
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
        isVerified: true,
    };
    const userData = { ...defaultUser, ...overrides };
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await User.create({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        isVerified: userData.isVerified,
        refreshToken: userData.refreshToken,
    });

    return {
        user,
        plainPassword: userData.password,
    };
}

/**
 * Parses cookies from supertest response headers.
 */
export function parseCookies(res) {
    const rawCookies = res.headers["set-cookie"] || [];
    const cookies = {};

    rawCookies.forEach((cookieStr) => {
        const parts = cookieStr.split(";")[0].split("=");
        const name = parts[0].trim();
        const value = parts.slice(1).join("=").trim();
        cookies[name] = value;
    });

    return cookies;
}

/**
 * Generates test access token.
 */
export function generateTestAccessToken(userId, expiresIn = "15m") {
    return jwt.sign(
        { user_id: userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn }
    );
}

/**
 * Generates test refresh token.
 */
export function generateTestRefreshToken(userId, expiresInSeconds = 7 * 24 * 60 * 60, iatOffset = -10) {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const iat = nowInSeconds + iatOffset;
    return jwt.sign(
        {
            user_id: userId,
            iat: iat,
            exp: iat + expiresInSeconds,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { noTimestamp: true }
    );
}
