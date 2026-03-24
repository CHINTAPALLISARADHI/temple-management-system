# Temple Management System

## Current State
New project. Empty scaffold with authorization component selected.

## Requested Changes (Diff)

### Add
- Home page (index) with temple info, hero banner, quick links
- Darshan page: view darshan timings, book darshan slot
- Seva page: browse and book seva services with priest assignment
- Rooms page: view available rooms and make booking requests
- Donation page: donate with amount, name, purpose selection
- Login/Register pages: user authentication
- Admin panel: manage bookings (darshan, seva, rooms), view donations, manage users
- Full navigation with links to all pages
- Backend Motoko actor with data models for: users, darshan bookings, seva bookings, room bookings, donations

### Modify
N/A (new project)

### Remove
N/A

## Implementation Plan
1. Generate Motoko backend with actors for all data entities
2. Build React frontend with React Router for multi-page navigation
3. Pages: Home, Darshan, Seva, Rooms, Donation, Login, Register, Admin
4. Authorization integration for login/register/admin access control
5. Admin dashboard with tabbed view for all bookings and donations
