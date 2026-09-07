import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define rotas que exigem login (todo o painel)
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/finance(.*)',
  '/tasks(.*)',
  '/goals(.*)',
  '/notes(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
