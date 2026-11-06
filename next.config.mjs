/** @type {import('next').NextConfig} */
// NEXT_DIST_DIR lets two dev servers run from this folder without sharing (and corrupting) one .next
const nextConfig = { serverExternalPackages: ["better-sqlite3"], distDir: process.env.NEXT_DIST_DIR || ".next" };
export default nextConfig;
