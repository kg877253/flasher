# Flasher Project Audit

**Date:** 2026-11-10

## Current status

Core project working:

- Authentication, cookies, refresh token
- Video upload, listing, playback, update, delete, publish
- Comments: add, edit, delete, like
- Tweets: create, edit, delete, like
- Playlists and subscriptions
- Channel pages and channel search
- Dashboard, Settings, Support
- Video owner/channel navigation

## Validation completed

- Frontend build: passed
- Frontend lint: passed
- Backend syntax check: passed
- No automated test suite exists yet

## Important remaining issues

### High priority

1. **Video visibility**
   - Video listing is public, but video detail is protected.
   - Decide whether published videos should be viewable without login.

2. **Duplicate likes/subscriptions**
   - `Like` and `Subscription` models have no compound unique indexes.
   - Fast repeated requests can create duplicates.

### Medium priority

3. **Validation**
   - Improve upload file-type validation.
   - Improve password/account/tweet/comment validation.

4. **Refresh-token failure**
   - If refresh fails permanently, frontend should clear auth state and redirect to login.

5. **Testing**
   - Add backend API tests.
   - Add frontend tests for comments, tweets, Settings, search, and token refresh.

### Low priority

6. `viewedBy` can grow indefinitely for popular videos.
7. Support email is currently a placeholder.
8. Startup port logging should show the actual fallback port.

## Recommended next order

1. Decide and fix video visibility.
2. Add unique database indexes.
3. Improve validation and refresh-failure UX.
4. Add automated tests.

## Main files

- Backend routes/controllers: `backend/src/routes`, `backend/src/controllers`
- Backend models: `backend/src/models`
- Frontend pages: `frontend/src/pages`
- Frontend components: `frontend/src/components`
- Frontend API layer: `frontend/src/api`
- Auth and token flow: `frontend/src/api/axios.js`, `frontend/src/context/AuthProvider.jsx`
