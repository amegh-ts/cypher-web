export const config = {
    env: process.env.NODE_ENV || "development",
    app: {
        url: process.env.NEXTAUTH_URL || "http://localhost:3000",
        secret: process.env.NEXTAUTH_SECRET,
    },
    db: {
        uri: process.env.MONGODB_URI,
    },
} as const;

if (!config.db.uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

if (!config.app.secret) {
    throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}
