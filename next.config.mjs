/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle for the Docker image
  output: "standalone",
  images: {
    domains: ["oaidalleapiprodscus.blob.core.windows.net","images.unsplash.com"],
  },
};

export default nextConfig;
