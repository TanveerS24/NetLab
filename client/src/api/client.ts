const API_URL = import.meta.env.VITE_API_URL;

export const api = async (
    endpoint: string,
    options?: RequestInit
) => {
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const response = await fetch(`${API_URL}${normalizedEndpoint}`, {
        ...options,
        headers: {
            "Content-type": "application/json",
            ...options?.headers
        }
    })

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}