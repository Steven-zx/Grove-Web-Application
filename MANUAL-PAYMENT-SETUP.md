# Manual GCash Payment System Setup Guide

## Overview
This system allows users to pay for bookings via direct GCash transfer and upload proof of payment for admin approval.

## Setup Steps

### 1. Database Setup
Run the SQL script in your Supabase SQL Editor:

```bash
# File location: backend/manual-payment-schema.sql
```

Go to your Supabase dashboard → SQL Editor → paste and run the script.

### 2. Configure Your GCash Details
Edit `backend/.env`:

```env
# Manual GCash Payment Configuration
MANUAL_GCASH_ENABLED=true
GCASH_ACCOUNT_NAME=Your Name or Business Name
GCASH_ACCOUNT_NUMBER=09XXXXXXXXX  # Replace with your actual GCash number
```

### 3. Restart Backend Server
```powershell
cd backend
npm start
```

### 4. Start Frontend
```powershell
cd frontend
npm run dev
```

## How It Works

### User Flow:
1. User selects amenity and fills booking form
2. Selects "GCash (Manual Transfer)" as payment method
3. After booking creation, redirected to manual payment page
4. Sees your GCash account details and instructions
5. Transfers money via their GCash app
6. Takes screenshot of successful transaction
7. Uploads screenshot as proof of payment
8. Booking status changes to "pending_approval"

### Admin Flow:
1. Admin goes to Payment Review page
2. Sees all bookings with status "pending_approval"
3. Views uploaded proof of payment screenshot
4. Can approve or reject the payment
5. If approved: booking status → "confirmed"
6. If rejected: booking status → "rejected"

## API Endpoints Added

### For Users:
- `GET /api/payments/manual/gcash-info` - Get GCash account details
- `POST /api/payments/manual/upload-proof` - Upload proof of payment

### For Admin:
- `POST /api/admin/payments/manual/review` - Approve/reject payment

## Frontend Routes Added

- `/payment/manual-gcash` - Manual payment page (user uploads proof)
- Admin: Import `PaymentReview` component in admin dashboard

## Database Changes

New columns in `bookings` table:
- `payment_proof_url` - URL to uploaded proof image
- `payment_amount` - Amount paid by user
- `admin_notes` - Admin comments on payment review

New booking statuses:
- `pending` - Initial status after booking
- `pending_approval` - After proof of payment uploaded
- `confirmed` - After admin approves payment
- `rejected` - After admin rejects payment

## Testing the Flow

1. **Create a booking:**
   - Go to Amenities → Book an amenity
   - Select "GCash (Manual Transfer)"
   - Fill form and submit

2. **Upload proof:**
   - You'll be redirected to manual payment page
   - See your GCash details
   - Upload any screenshot (for testing)
   - Submit

3. **Admin review:**
   - Login as admin
   - Navigate to Payment Review page
   - See pending payments
   - Approve or reject

## Important Notes

- ⚠️ **Update GCASH_ACCOUNT_NUMBER** in `.env` with your actual number!
- ⚠️ Proof of payment images are stored in Supabase Storage (gallery bucket)
- ✅ No business registration needed - this is a manual process
- ✅ No API fees or transaction fees
- ✅ You receive real money directly to your GCash account
- ⚠️ Requires manual admin approval for each payment

## Advantages
- ✅ Accept real payments immediately
- ✅ No business permit required
- ✅ No API fees
- ✅ Money goes directly to your GCash

## Disadvantages
- ⚠️ Manual process (admin must review each payment)
- ⚠️ Not instant confirmation
- ⚠️ Potential for fake screenshots (verify carefully)

## Security Tips
1. Always verify the transaction details match
2. Check the amount, date, and reference number
3. Cross-check with your GCash transaction history
4. Add admin notes when approving/rejecting

## Next Steps
1. Update your GCash details in `.env`
2. Run the database migration
3. Restart backend server
4. Test the full flow
5. Integrate Payment Review into admin dashboard

---

**Status:** ✅ Fully implemented and ready to test!
