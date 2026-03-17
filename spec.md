# Kallu Sweets & Namkeen Shop

## Current State
- Homepage with carousel, welcome card, menu (4 dropdown categories), reviews (static), about, contact
- Cart with WhatsApp/Call checkout
- Delivery banner at top
- Reviews section shows 4 hardcoded testimonials only — customers cannot submit reviews

## Requested Changes (Diff)

### Add
- Prominent "Important Note" box on homepage, placed ABOVE the menu section (i.e., above the Breakfast category), with two Hindi/English points:
  1. Min ₹100 ka order compulsory hai home delivery ke liye
  2. Home delivery only 5 km ke andar available hai
- Customer review submission form in the Reviews section: fields — Product Name (text), Customer Name, Star Rating (1–5), Review Text, Submit button
- Backend API to save and retrieve customer-submitted reviews
- Display all submitted reviews alongside existing static reviews

### Modify
- Reviews section: make it dynamic — load reviews from backend + show submission form below existing reviews

### Remove
- Nothing removed

## Implementation Plan
1. Update `src/backend/main.mo` to add `Review` type, `addReview` (public shared), `getReviews` (public query)
2. Update `App.tsx`:
   - Add `ImportantNote` component/block above menu section with styled box
   - Wire `addReview` and `getReviews` from backend
   - Add review submission form (product, name, rating, text)
   - Merge static + dynamic reviews in display
