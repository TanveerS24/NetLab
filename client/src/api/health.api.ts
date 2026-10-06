import { api } from "./client.ts";

export const healthAPI = async () => {
    return api("health", {
        method: "GET"
    })
};