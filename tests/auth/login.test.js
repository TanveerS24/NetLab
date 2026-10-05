import { describe, it, expect } from "vitest";
import request from "supertest";
import crypto from "crypto";
import app from "../../server/app.js";
import User from "../../server/models/user.model.js";
import { createTestUser, parseCookies } from "../helpers/auth.helper.js";

describe("Authentication - Login (/api/v1/auth/login)", () => {
    it("should successfully log in with valid username and password", async () => {
        const { user, plainPassword } = await createTestUser({
            username: "loginuser",
            email: "loginuser@example.com",
            password: "mypassword123",
        });

        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: user.username,
                password: plainPassword,
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Logged in successfully");

        // Verify cookies are set
        const cookies = parseCookies(res);
        expect(cookies.accessToken).toBeDefined();
        expect(cookies.refreshToken).toBeDefined();

        // Verify Set-Cookie header flags
        const setCookieHeaders = res.headers["set-cookie"].join("; ");
        expect(setCookieHeaders).toMatch(/HttpOnly/i);
        expect(setCookieHeaders).toMatch(/SameSite=Strict/i);
    });

    it("should successfully log in with valid email and password", async () => {
        const { user, plainPassword } = await createTestUser({
            username: "emailuser",
            email: "emailuser@example.com",
            password: "emailpassword123",
        });

        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: user.email,
                password: plainPassword,
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Logged in successfully");

        const cookies = parseCookies(res);
        expect(cookies.accessToken).toBeDefined();
        expect(cookies.refreshToken).toBeDefined();
    });

    it("should return 401 when password is wrong", async () => {
        const { user } = await createTestUser({
            username: "wrongpassuser",
            email: "wrongpass@example.com",
            password: "correctpassword",
        });

        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: user.username,
                password: "incorrectpassword",
            });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid credentials");
    });

    it("should return 404 with error message for non-existent user", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "nonexistentuser",
                password: "password123",
            });

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid Credentials");
    });

    it("should return 400 when identifier or password is missing", async () => {
        // Missing password
        const resNoPass = await request(app)
            .post("/api/v1/auth/login")
            .send({ identifier: "someuser" });
        expect(resNoPass.status).toBe(400);
        expect(resNoPass.body.success).toBe(false);
        expect(resNoPass.body.message).toBe("All fields are required");

        // Missing identifier
        const resNoId = await request(app)
            .post("/api/v1/auth/login")
            .send({ password: "somepassword" });
        expect(resNoId.status).toBe(400);
        expect(resNoId.body.success).toBe(false);
        expect(resNoId.body.message).toBe("All fields are required");

        // Empty body
        const resEmpty = await request(app)
            .post("/api/v1/auth/login")
            .send({});
        expect(resEmpty.status).toBe(400);
        expect(resEmpty.body.success).toBe(false);
        expect(resEmpty.body.message).toBe("All fields are required");
    });

    it("should never return the user's password in the response", async () => {
        const { user, plainPassword } = await createTestUser({
            username: "nopassreturnuser",
            email: "nopassreturn@example.com",
            password: "hiddenPassword123",
        });

        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: user.username,
                password: plainPassword,
            });

        expect(res.status).toBe(200);
        expect(res.body.password).toBeUndefined();
        if (res.body.data) {
            expect(res.body.data.password).toBeUndefined();
        }
    });

    it("should store the refresh token in MongoDB as hashed", async () => {
        const { user, plainPassword } = await createTestUser({
            username: "refreshtokencheck",
            email: "refreshcheck@example.com",
            password: "mypassword123",
        });

        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: user.username,
                password: plainPassword,
            });

        expect(res.status).toBe(200);

        const cookies = parseCookies(res);
        const plainRefreshToken = cookies.refreshToken;
        expect(plainRefreshToken).toBeDefined();

        const updatedUser = await User.findById(user._id);
        expect(updatedUser.refreshToken).toBeDefined();
        // Refresh token in MongoDB must NOT equal plaintext refresh token
        expect(updatedUser.refreshToken).not.toBe(plainRefreshToken);

        // SHA-256 hash comparison must match
        const expectedHash = crypto.createHash("sha256").update(plainRefreshToken).digest("hex");
        expect(updatedUser.refreshToken).toBe(expectedHash);
    });
});
