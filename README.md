# TALA - Trust is Code API

A zero-trust time capsule system for Indian exam, tender, and evidence workflows built with Go and Next.js.

## Features

- 🔐 **Secure File Encryption**: AES-256-GCM encryption client-side and on-device
- ⏰ **Time-Locked Capsules**: Pre-programmed unlock schedules
- ✍️ **Wallet Integration**: Sign and commit with blockchain signatures
- 📊 **Audit Trail**: Forever immutable on-chain audit logs with IPFS pinning
- 🌐 **Public Verification**: Anyone can verify capsule integrity via on-chain logs

## Project Structure

```
tala-api/
├── backend/          # Go API server
│   ├── main.go
│   ├── models/       # Database models
│   ├── handlers/     # API endpoint handlers
│   ├── middleware/   # Auth & CORS middleware
│   ├── utils/        # Utilities (crypto, JWT)
│   └── go.mod
└── frontend/         # Next.js web interface
    ├── src/
    │   ├── app/      # Pages (Home, Dashboard, Login, etc)
    │   ├── components/# Reusable components
    │   └── lib/      # Utilities & API client
    └── package.json
```

## Backend Setup

### Prerequisites
- Go 1.21 or higher
- SQLite (included with Go)

### Installation

```bash
cd backend

# Install dependencies
go mod download

# Copy environment variables
cp .env.example .env

# Run the server
go run main.go
```

The API will be available at `http://localhost:8080`

### Environment Variables (.env)
```
PORT=8080
DB_PATH=tala.db
JWT_SECRET=your-secret-key-change-in-production
```

## Frontend Setup

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Environment Variables (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Login with email/password
- `POST /api/v1/auth/login-wallet` - Login with wallet

### Capsules (Protected)
- `POST /api/v1/capsules` - Create new capsule
- `GET /api/v1/capsules` - List user's capsules
- `GET /api/v1/capsules/:id` - Get capsule details
- `PUT /api/v1/capsules/:id` - Update capsule
- `DELETE /api/v1/capsules/:id` - Delete capsule

### Signing & Unlocking (Protected)
- `POST /api/v1/capsules/:id/sign` - Sign & commit capsule
- `GET /api/v1/capsules/:id/unlock` - Check unlock time eligibility
- `POST /api/v1/capsules/:id/unlock` - Unlock capsule

### Audit Trail
- `GET /api/v1/capsules/:id/audit` - Get audit trail for capsule
- `GET /api/v1/audit` - Get all audit trails (protected)

### Dashboard
- `GET /api/v1/dashboard/stats` - Get user stats (protected)
- `GET /api/v1/public/stats` - Get public stats

## Frontend Pages

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - User dashboard with capsules list
- `/create-capsule` - Create new capsule
- `/capsule/:id` - Capsule details with timeline and audit trail

## Database Schema

### Users
- id (UUID)
- email (unique)
- wallet_addr (unique, optional)
- password_hash
- created_at, updated_at

### Capsules
- id (UUID)
- user_id (FK)
- title, description
- file_hash, encryption_type
- status (CREATED, SIGNED, UNLOCKED)
- unlock_time, is_locked
- created_at, updated_at

### Signatures
- id (UUID)
- capsule_id (FK)
- signed_by (user)
- signature, checksum
- ipfs_hash
- signed_at, created_at

### Audit Trails
- id (UUID)
- capsule_id (FK)
- action (CREATE, SIGN, UNLOCK, VERIFY)
- actor (user)
- details, ipfs_hash
- timestamp, created_at

## Security Features

1. **Authentication**: JWT-based token authentication
2. **Authorization**: User-specific access to capsules
3. **Encryption**: AES-256-GCM for file encryption
4. **Hashing**: SHA-256 for data integrity
5. **CORS**: Configured for cross-origin requests

## Deployed URLs

- API: Will be deployed to production
- Frontend: Will be deployed to production

## Next Steps

1. Add Ethereum wallet integration (MetaMask)
2. Implement IPFS pinning service
3. Add on-chain verification via smart contracts
4. Implement file upload to IPFS
5. Add email notifications for unlock events
6. Performance optimizations and caching
7. Admin dashboard for statistics

## License

MIT License - feel free to use in your projects

## Support

For issues or questions, please open an issue on GitHub.
