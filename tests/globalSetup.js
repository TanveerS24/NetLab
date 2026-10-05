import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

export async function setup() {
    mongod = await MongoMemoryServer.create({
        instance: {
            launchTimeout: 60000,
        },
    });
    process.env.TEST_MONGODB_URI = mongod.getUri();
}

export async function teardown() {
    if (mongod) {
        await mongod.stop();
    }
}
