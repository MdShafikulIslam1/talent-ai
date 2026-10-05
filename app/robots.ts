import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    // Only the public marketing page is worth indexing; the app needs an account.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard", "/settings", "/profile"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
