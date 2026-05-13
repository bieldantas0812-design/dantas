# Security Specification - StreetManager

## Data Invariants
1. A sale cannot be registered without a valid product ID.
2. An inventory item must have a positive unit price and quantity.
3. A product's status can only be one of the predefined values.
4. User can only read and write their own data (assuming multi-tenancy or single-user admin). In this context, usually, these apps are admin-only tools. I will enforce that only authenticated users can access the database, and if the app was multi-tenant, it would use `ownerId`. For this specific request, it seems like a single-brand tool, but I'll add `userId` to all documents for safety.

## The Dirty Dozen Payloads
1. **Unauthorized Write**: Attempting to write to `inventory_items` without authentication.
2. **Negative Price**: Creating an `InventoryItem` with `unitPrice: -10`.
3. **Ghost Field**: Adding `isAdmin: true` to a user profile or any document.
4. **Invalid Collection**: Writing to `/secrets/`.
5. **ID Poisoning**: Using a 2KB string as a `saleId`.
6. **State Jumping**: Changing a product status from `ideia` directly to `esgotada` (though in this app it might be allowed, I'll restrict status to valid enums).
7. **Large Payload**: Sending a 2MB document.
8. **Broken Reference**: Creating a `Sale` for a `productId` that doesn't exist.
9. **Identity Spoofing**: Attempting to write a document with a `userId` that isn't `request.auth.uid`.
10. **Timestamp Faking**: Providing a client-side `timestamp` that is in the future.
11. **Negative Stock**: Selling more items than available (this requires atomic checks).
12. **PII Leak**: Reading `clients` collection without being the brand owner.

## Test Runner (Logic Overview)
The `firestore.rules` will be tested using standard Firebase Emulator tools or within the logic of the rules themselves to ensure:
- `request.auth != null`
- `request.resource.data.userId == request.auth.uid`
- `isValidId(projectId)`
- `isValid[Entity](incoming())`
