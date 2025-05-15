/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
// import withPWA from 'next-pwa';

// const nextConfig = {
//   reactStrictMode: true, // Correct placement
//   pwa: {
//     dest: 'public',
//     disable: process.env.NODE_ENV === 'development',
//     register: true,
//     skipWaiting: true,
//   }
// };

// export default withPWA(nextConfig);