import { describe, it, expect } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import app from "../../server/app.js";
import User from "../../server/models/user.model.js";
import { createTestUser, generateTestRefreshToken, parseCookies } from "../helpers/auth.helper.js";

describe("Authentication - Refresh Token (/api/v1/auth/refreshToken)", () => {
    it("should successfully generate new access token and refresh token with valid refresh token", async () => {
        const { user } = await createTestUser({
            username: "refreshvaliduser",
            email: "refreshvalid@example.com",
        });

        const initialRefreshToken = generateTestRefreshToken(user._id);
        const hashedInitialToken = await bcrypt.hash(initialRefreshToken, 10);
        await User.findByIdAndUpdate(user._id, { refreshToken: hashedInitialToken });

        const res = await request(app)
            .post("/api/v1/auth/refreshToken")
            .set("Cookie", [`refreshToken=${initialRefreshToken}`]);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Tokens refreshed successfully");

        const cookies = parseCookies(res);
        expect(cookies.accessToken).toBeDefined();
        expect(cookies.refreshToken).toBeDefined();
    });

    it("should perform refresh token rotation and update hashed token in database", async () => {
        const { user } = await createTestUser({
            username: "rotationuser",
            email: "rotation@example.com",
        });

        const initialRefreshToken = generateTestRefreshToken(user._id);
        const hashedInitialToken = await bcrypt.hash(initialRefreshToken, 10);
        await User.findByIdAndUpdate(user._id, { refreshToken: hashedInitialToken });

        const res = await request(app)
            .post("/api/v1/auth/refreshToken")
            .set("Cookie", [`refreshToken=${initialRefreshToken}`]);

        expect(res.status).toBe(200);

        const cookies = parseCookies(res);
        const newRefreshToken = cookies.refreshToken;
        expect(newRefreshToken).toBeDefined();
        expect(newRefreshToken).not.toBe(initialRefreshToken);

        // Verify database has the new token hashed
        const updatedUser = await User.findById(user._id);
        expect(updatedUser.refreshToken).not.toBe(hashedInitialToken);
        expect(updatedUser.refreshToken).not.toBe(newRefreshToken);

        const isMatchNew = await bcrypt.compare(newRefreshToken, updatedUser.refreshToken);
        expect(isMatchNew).toBe(true);
    });

    it("should invalidate old refresh token after rotation", async () => {
        const { user } = await createTestUser({
            username: "oldtokenuser",
            email: "oldtoken@example.com",
        });

        const initialRefreshToken = generateTestRefreshToken(user._id);
        const hashedInitialToken = await bcrypt.hash(initialRefreshToken, 10);
        await User.findByIdAndUpdate(user._id, { refreshToken: hashedInitialToken });

        // First refresh - rotates token
        const res1 = await request(app)
            .post("/api/v1/auth/refreshToken")
            .set("Cookie", [`refreshToken=${initialRefreshToken}`]);
        expect(res1.status).toBe(200);

        // Second refresh using the old initial token must be rejected (401 Unauthorized)
        const res2 = await request(app)
            .post("/api/v1/auth/refreshToken")
            .set("Cookie", [`refreshToken=${initialRefreshToken}`]);

        expect(res2.status).toBe(401);
        expect(res2.body.success).toBe(false);
        expect(res2.body.message).toBe("Unauthorized");
    });

    it("should return 401 when refresh token is missing", async () => {
        const res = await request(app)
            .post("/api/v1/auth/refreshToken");

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Unauthorized");
    });

    it("should return 401 when refresh token is invalid", async () => {
        const res = await request(app)
            .post("/api/v1/auth/refreshToken")
            .set("Cookie", ["refreshToken=corrupted.or.invalid.token"]);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid or expired refresh token");
    });

    it("should return 401 when refresh token is expired", async () => {
        const { user } = await createTestUser({
            username: "expiredrefreshuser",
            email: "expiredrefresh@example.com",
        });

        const expiredRefreshToken = jwt.sign(
            { user_id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "-1s" }
        );

        const hashedExpiredToken = await bcrypt.hash(expiredRefreshToken, 10);
        await User.findByIdAndUpdate(user._id, { refreshToken: hashedExpiredToken });

        const res = await request(app)
            .post("/api/v1/auth/refreshToken")
            .set("Cookie", [`refreshToken=${expiredRefreshToken}`]);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid or expired refresh token");
    });

    it("should ensure refresh token stored in MongoDB is hashed rather than plaintext", async () => {
        const { user } = await createTestUser({
            username: "hashcheckrefresh",
            email: "hashcheckrefresh@example.com",
        });

        const initialRefreshToken = generateTestRefreshToken(user._id);
        const hashedInitialToken = await bcrypt.hash(initialRefreshToken, 10);
        await User.findByIdAndUpdate(user._id, { refreshToken: hashedInitialToken });

        const res = await request(app)
            .post("/api/v1/auth/refreshToken")
            .set("Cookie", [`refreshToken=${initialRefreshToken}`]);

        expect(res.status).toBe(200);

        const cookies = parseCookies(res);
        const newRefreshToken = cookies.refreshToken;

        const dbUser = await User.findById(user._id);
        expect(dbUser.refreshToken).not.toBe(newRefreshToken);
        expect(dbUser.refreshToken.startsWith("$2")).toBe(true);
    });
});
