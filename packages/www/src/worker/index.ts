import { Hono } from "hono";

const app = new Hono();

app.get("/api/", (c) => {
    console.log("hono!");
    return c.json({
        id: "f9a5d8c0-1b3e-4a7c-8f0e-2d9b1c3a5e7b",
        user: {
            name: "Alice Wonderland",
            email: "alice.wonder@example.com",
            isActive: true,
            roles: ["admin", "editor"],
            preferences: {
                theme: "dark",
                notifications: {
                    email: true,
                    sms: false,
                },
            },
            address: null,
        },
        products: [
            { id: 1, name: "Laptop", price: 1200.5 },
            { id: 2, name: "Mouse", price: 25.99 },
            { id: 3, name: "Keyboard", price: 75.0 },
        ],
        metadata: {
            createdAt: "2025-05-04T15:46:00Z",
            version: 2.1,
            tags: ["data", "example", "nested"],
        },
        emptyObject: {},
        emptyArray: [],
    });
});

export default app;
