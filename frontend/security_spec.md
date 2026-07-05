# Security Specification - Bioprisma

## Data Invariants
1. Users are identified by a unique 10-character key generated during registration.
2. A user can only read their own profile if they know the key.
3. A user can only create their own profile once with a unique key.
4. Accounts are persistent and link a name to a key.

## The "Dirty Dozen" Payloads
1. **Unauthorized Read**: Attempt to read `users/INVALID_KEY` without being signed in (using anonymous auth).
2. **Key Spoofing**: Attempt to overwrite an existing user's name with a new one.
3. **Ghost Field**: Attempt to add `isAdmin: true` to a user profile.
4. **Invalid Key ID**: Attempt to create a user with a 1KB string as doc ID.
5. **Timestamp Spoofing**: Attempt to set a future date for `createdAt`.
6. **Self-Promotion**: Updating `role` field (even if not in blueprint).
7. **Mass Scraping**: Listing all users in the `users` collection.
8. **Blanket Read**: `allow read: if isSignedIn()` without resource check.
9. **Identity Poisoning**: Doc ID with special characters like `/` or `.`.
10. **Data Injection**: Very long strings for `name`.
11. **Orphaned Write**: Writing to a subcollection (if any) without parent document.
12. **State Shortcutting**: Updating `createdAt` after initial creation.

## The Test Runner
A `firestore.rules.test.ts` would verify that users can only get/write documents if the ID matches their knowledge and structure.
