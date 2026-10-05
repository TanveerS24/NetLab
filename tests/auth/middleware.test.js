import { describe, it, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../server/app.js";
import { createTestUser, generateTestAccessToken } from "../helpers/auth.helper.js";

describe("Authentication - Access Token Middleware (AuthMiddleWare)", () => {
    it("should allow request with valid access token and populate user info", async () => {
        const { user } = await createTestUser({
            username: "authmwuser",
            email: "authmw@example.com",
        });

        const validAccessToken = generateTestAccessToken(user._id);

        const res = await request(app)
            .get("/api/v1/auth/profile")
            .set("Cookie", [`accessToken=${validAccessToken}`]);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBe(user._id.toString());
        expect(res.body.data.username).toBe(user.username);
    });

    it("should return 401 Unauthorized when access token is missing", async () => {
        const res = await request(app)
            .get("/api/v1/auth/profile");

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Unauthorized");
    });

    it("should return 401 when access token is invalid", async () => {
        const invalidToken = "invalid.token.structure123";

        const res = await request(app)
            .get("/api/v1/auth/profile")
            .set("Cookie", [`accessToken=${invalidToken}`]);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid access token");
    });

    it("should return 401 when access token is signed with a different secret", async () => {
        const forgedToken = jwt.sign(
            { user_id: "fakeuserid123" },
            "wrong_secret_key_12345678",
            { expiresIn: "15m" }
        );

        const res = await request(app)
            .get("/api/v1/auth/profile")
            .set("Cookie", [`accessToken=${forgedToken}`]);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid access token");
    });

    it("should return 401 when access token is expired", async () => {
        const { user } = await createTestUser({
            username: "expireduser",
            email: "expired@example.com",
        });

        // Expired token (0s expiry or negative offset)
        const expiredToken = jwt.sign(
            { user_id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "-1s" }
        );

        const res = await request(app)
            .get("/api/v1/auth/profile")
            .set("Cookie", [`accessToken=${expiredToken}`]);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid access token");
    });
});
