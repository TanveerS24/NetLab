import mongoose from "mongoose";
import { beforeAll, afterEach, afterAll } from "vitest";

// Set required dummy environment variables for tests (fake secrets for test isolation only)
process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "test-access-token-secret-key-123456789";
process.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "test-refresh-token-secret-key-987654321";
process.env.NODE_ENV = "test";

beforeAll(async () => {
    const uri = process.env.TEST_MONGODB_URI;
    if (uri && mongoose.connection.readyState === 0) {
        await mongoose.connect(uri);
    }
});

afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    }
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
});
