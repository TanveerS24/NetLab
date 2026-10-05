import { describe, it, expect } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../server/app.js";
import User from "../../server/models/user.model.js";
import { createTestUser, generateTestAccessToken, generateTestRefreshToken } from "../helpers/auth.helper.js";

describe("Authentication - Protected User Profile (/api/v1/auth/profile)", () => {
    it("should allow an authenticated user to retrieve their own profile", async () => {
        const { user } = await createTestUser({
            username: "profileuser",
            email: "profileuser@example.com",
        });

        const accessToken = generateTestAccessToken(user._id);

        const res = await request(app)
            .get("/api/v1/auth/profile")
            .set("Cookie", [`accessToken=${accessToken}`]);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Profile fetched successfully");
        expect(res.body.data).toBeDefined();
        expect(res.body.data._id).toBe(user._id.toString());
        expect(res.body.data.username).toBe(user.username);
        expect(res.body.data.email).toBe(user.email);
    });

    it("should never return password or refreshToken in profile responses", async () => {
        const initialRefreshToken = generateTestRefreshToken("dummyId");
        const hashedRefreshToken = await bcrypt.hash(initialRefreshToken, 10);

        const { user } = await createTestUser({
            username: "secretcheckuser",
            email: "secretcheck@example.com",
            refreshToken: hashedRefreshToken,
        });

        const accessToken = generateTestAccessToken(user._id);

        const res = await request(app)
            .get("/api/v1/auth/profile")
            .set("Cookie", [`accessToken=${accessToken}`]);

        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.password).toBeUndefined();
        expect(res.body.data.refreshToken).toBeUndefined();
    });

    it("should reject unauthenticated requests to protected profile endpoint", async () => {
        const res = await request(app)
            .get("/api/v1/auth/profile");

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Unauthorized");
    });
});
