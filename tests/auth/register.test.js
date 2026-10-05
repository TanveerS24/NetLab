import { describe, it, expect } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../server/app.js";
import User from "../../server/models/user.model.js";

describe("Authentication - Registration (/api/v1/auth/register)", () => {
    it("should successfully register a user with valid credentials", async () => {
        const payload = {
            username: "newuser",
            email: "newuser@example.com",
            password: "strongpassword123",
        };

        const res = await request(app)
            .post("/api/v1/auth/register")
            .send(payload);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User registered successfully");

        // Verify user exists in the database
        const savedUser = await User.findOne({ email: payload.email });
        expect(savedUser).not.toBeNull();
        expect(savedUser.username).toBe(payload.username);
    });

    it("should return 400 when required fields are missing", async () => {
        // Missing username
        const resNoUsername = await request(app)
            .post("/api/v1/auth/register")
            .send({
                email: "nouser@example.com",
                password: "password123",
            });
        expect(resNoUsername.status).toBe(400);
        expect(resNoUsername.body.success).toBe(false);
        expect(resNoUsername.body.message).toBe("All fields are required");

        // Missing email
        const resNoEmail = await request(app)
            .post("/api/v1/auth/register")
            .send({
                username: "noemailuser",
                password: "password123",
            });
        expect(resNoEmail.status).toBe(400);
        expect(resNoEmail.body.success).toBe(false);
        expect(resNoEmail.body.message).toBe("All fields are required");

        // Missing password
        const resNoPassword = await request(app)
            .post("/api/v1/auth/register")
            .send({
                username: "nopassuser",
                email: "nopass@example.com",
            });
        expect(resNoPassword.status).toBe(400);
        expect(resNoPassword.body.success).toBe(false);
        expect(resNoPassword.body.message).toBe("All fields are required");

        // Empty body
        const resEmpty = await request(app)
            .post("/api/v1/auth/register")
            .send({});
        expect(resEmpty.status).toBe(400);
        expect(resEmpty.body.success).toBe(false);
        expect(resEmpty.body.message).toBe("All fields are required");
    });

    it("should reject duplicate username", async () => {
        await User.create({
            username: "existinguser",
            email: "first@example.com",
            password: "hashedPassword123",
        });

        const res = await request(app)
            .post("/api/v1/auth/register")
            .send({
                username: "existinguser",
                email: "second@example.com",
                password: "newpassword123",
            });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User already exists");
    });

    it("should reject duplicate email", async () => {
        await User.create({
            username: "userone",
            email: "duplicate@example.com",
            password: "hashedPassword123",
        });

        const res = await request(app)
            .post("/api/v1/auth/register")
            .send({
                username: "usertwo",
                email: "duplicate@example.com",
                password: "newpassword123",
            });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User already exists");
    });

    it("should store the password hashed and never in plaintext", async () => {
        const plainPassword = "superSecretPassword123!";
        const payload = {
            username: "hashcheckuser",
            email: "hashcheck@example.com",
            password: plainPassword,
        };

        const res = await request(app)
            .post("/api/v1/auth/register")
            .send(payload);

        expect(res.status).toBe(201);

        const savedUser = await User.findOne({ email: payload.email });
        expect(savedUser.password).not.toBe(plainPassword);

        // Verify with bcrypt that hash corresponds to the plain password
        const isMatch = await bcrypt.compare(plainPassword, savedUser.password);
        expect(isMatch).toBe(true);
    });
});
