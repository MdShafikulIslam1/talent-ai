import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Share images, icons and auth pages must load without a session (crawlers and signed-out visitors).
  publicRoutes: [
    "/",
    "/api/webhook",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/opengraph-image(.*)",
    "/apple-icon(.*)",
    "/icon(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
