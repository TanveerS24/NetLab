import { describe, it, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../server/app.js";
import { createTestUser, generateTestAccessToken } from "../helpers/auth.helper.js";

describe("Authentication - Logout (/api/v1/auth/logout)", () => {
    it("should successfully log out and clear accessToken and refreshToken cookies", async () => {
        const { user } = await createTestUser({
            username: "logoutuser",
            email: "logout@example.com",
        });
        const accessToken = generateTestAccessToken(user._id);

        const res = await request(app)
            .post("/api/v1/auth/logout")
            .set("Cookie", [`accessToken=${accessToken}`]);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Logged out successfully");

        // Verify cookies are cleared (expires in past / empty value)
        const setCookies = res.headers["set-cookie"] || [];
        const accessCookie = setCookies.find((c) => c.startsWith("accessToken="));
        const refreshCookie = setCookies.find((c) => c.startsWith("refreshToken="));

        expect(accessCookie).toBeDefined();
        expect(refreshCookie).toBeDefined();
        // Cookie clearance headers typically set value to empty or Expires in past (1970)
        expect(accessCookie).toMatch(/accessToken=;|accessToken=($|;)|Expires=Thu, 01 Jan 1970/i);
        expect(refreshCookie).toMatch(/refreshToken=;|refreshToken=($|;)|Expires=Thu, 01 Jan 1970/i);
    });

    it("should succeed even when access token is expired or not provided", async () => {
        const { user } = await createTestUser({
            username: "logoutexpired",
            email: "logoutexpired@example.com",
        });

        const expiredToken = jwt.sign(
            { user_id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "-10s" }
        );

        const res = await request(app)
            .post("/api/v1/auth/logout")
            .set("Cookie", [`accessToken=${expiredToken}`]);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Logged out successfully");
    });
});
