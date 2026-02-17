/** @type {import('next').NextConfig} */
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
    reactStrictMode: true,
    experimental: {
        turbo: {
            resolveAlias: {
                canvas: "./empty-module.ts",
            },
        },
    },
};

export default withPWA(nextConfig);
