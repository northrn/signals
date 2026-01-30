# Agents Knowledge Base

This file contains institutional knowledge discovered across Ralph iterations and development sessions. AI agents automatically read this file to understand project patterns and avoid repeating mistakes.

## Project Overview

**Signals** is a Next.js 15 AI news platform with:
- TypeScript + React 19
- Tailwind CSS for styling
- Supabase for database/auth
- Trigger.dev for background jobs
- Admin approval system for posts

## Codebase Patterns

### File Structure
```
src/
├── app/           # Next.js App Router pages
│   ├── api/       # API routes
│   └── profile/   # User profile pages
├── components/    # React components
├── trigger/       # Trigger.dev jobs
└── utils/         # Utility functions
```

### Component Conventions
- Use `'use client'` directive for interactive components
- Props interfaces named `[Component]Props`
- Export default for page components
- Named exports for utility components

### Database (Supabase)
- Schema defined in `database.sql`
- Use `@supabase/supabase-js` client
- Server components can use service role key
- Client components use anon key

### Styling
- Tailwind utility classes only
- Dark mode via `dark:` prefix
- Responsive: `sm:`, `md:`, `lg:`, `xl:`

## Quality Commands

```bash
npm run typecheck    # TypeScript validation
npm run lint         # ESLint checks
npm run build        # Production build
npm run dev          # Development server
```

## Common Gotchas

### Supabase Auth Token in API Routes
When calling API routes from client components, you must pass the Supabase auth token in the Authorization header. Use `supabase.auth.getSession()` to get the token, not `getUser()`:
```typescript
const { data: { session } } = await supabase.auth.getSession();
const response = await fetch('/api/notifications', {
  headers: { 'Authorization': `Bearer ${session.access_token}` }
});
```

### RLS Policies for Notifications
Notifications table needs a permissive INSERT policy (`WITH CHECK (true)`) because notifications are created server-side on behalf of other users. The SELECT/UPDATE policies should still restrict by `auth.uid() = user_id`.

### Trigger.dev Environment Variables
Trigger.dev requires `SUPABASE_SERVICE_ROLE_KEY` (not anon key) because background jobs run outside the user's session context. The service role key bypasses RLS.

### Self-Notification Prevention
Always check if the actor is the same as the recipient before sending notifications:
```typescript
if (post.user_id === payload.voterId) {
  return { success: true, message: "No self-notification needed" };
}
```

### Real-time Subscriptions Cleanup
Supabase channels must be removed on component unmount to prevent memory leaks:
```typescript
useEffect(() => {
  const channel = supabase.channel('notifications').on(...).subscribe();
  return () => { supabase.removeChannel(channel); };
}, [user.id]);
```

## Learnings from Previous Iterations

### 2026-01-29: Notifications System Implementation

**Pattern: Graceful Degradation for Non-Critical Operations**
When triggering notifications after a vote, wrap the notification call in try/catch and don't fail the main operation:
```typescript
try {
  await triggerVoteNotification(post.id, currentUserId, 'up');
} catch (notificationError) {
  // Don't fail the vote if notification fails
  console.error('Failed to send vote notification:', notificationError);
}
```

**Pattern: Auth Modal for Guest Users**
Instead of redirecting unauthenticated users to login, show a modal that explains what they'll get by signing up. This improves conversion by keeping users in context:
```typescript
if (!currentUserId) {
  setShowAuthModal(true);
  return;
}
```

**Pattern: Dual Architecture (Core + Enhanced)**
Design features with a core implementation that works without external dependencies (Trigger.dev), then add enhanced capabilities when those services are available. This prevents vendor lock-in and ensures basic functionality always works.

**Pattern: Database Triggers for Computed Fields**
Use PostgreSQL triggers to maintain `vote_count` and `comment_count` instead of computing them on each query. This improves read performance at minimal write cost.

**Pattern: Real-time Notifications with Supabase**
Use Supabase postgres_changes to get instant notifications without polling:
```typescript
supabase.channel('notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${user.id}`,
  }, handleNewNotification)
  .subscribe();
```

**Convention: Notification Types as Union Types**
Define notification types as TypeScript unions matching the database CHECK constraint:
```typescript
type: 'vote' | 'comment' | 'post_approved' | 'post_rejected' | 'mention'
```

**Convention: API Route Structure for Notifications**
Use a single `/api/notifications` endpoint with a `type` field to determine the notification kind. This keeps the API surface small while supporting multiple notification types.

---

*This file is automatically updated by Ralph iterations. Do not remove sections.*
