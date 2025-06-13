/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com'], // Add the Cloudinary domain here
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'another-domain.com',
            },
        ]
    },
    env: {
        MONGODB_URI: process.env.MONGODB_URI,
    },
};

export default nextConfig;
