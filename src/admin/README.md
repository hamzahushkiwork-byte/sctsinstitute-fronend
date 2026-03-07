# Admin Dashboard

## Development Notes

**IMPORTANT**: Apply changes incrementally; verify after each change.

When making UI changes:
1. Test public routes first (/, /about, /services)
2. Test admin routes (/admin/login, /admin)
3. Verify no blank screens or console errors
4. Commit working state before major refactors

## Current Status

- Theme: Uses hardcoded colors (not theme tokens) for stability
- Layout: AdminLayout with Sidebar and Topbar
- Routing: AdminRoutes with RouteGuard protection



