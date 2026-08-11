# Mourika - Festive Luxury E-Commerce

Mourika is a modern, high-performance Next.js e-commerce application built with Next.js App Router, Prisma ORM, Razorpay payment gateway integration, and automated Shiprocket logistics fulfillment.

---

## Shiprocket Logistics & Authentication Architecture

The logistics module (`lib/shiprocket.ts`) provides automated order sync, real-time pincode serviceability, AWB tracking, and resilient API token management.

### Key Architecture Features

1. **9-Day Token Caching**:
   Shiprocket JWT tokens are valid for 10 days (240 hours). `getShiprocketToken()` caches valid tokens in memory for 9 days (`777,600,000 ms`), eliminating unnecessary login requests on order placement or pincode checks.

2. **Circuit-Breaker Rate Limit Guard**:
   If a login call fails or encounters an IP restriction/rate limit (HTTP 401/403/400/429), an automated 1-hour backoff window (`authLockoutUntil`) is activated in server memory to fail fast locally and prevent API ban loops.

3. **Manual Auth Pause Switch**:
   Support for `SHIPROCKET_AUTH_PAUSED=true` in environment variables to immediately block all outgoing HTTP auth traffic to Shiprocket during maintenance or IP whitelisting.

4. **Environment Variable & Special Character Sanitizer**:
   `cleanEnvVal()` automatically strips wrapping quotes, newlines, carriage returns, trailing spaces, unescapes backslash-escaped characters (`\$` -> `$`, `\&` -> `&`), and unescapes HTML entities (`&amp;` -> `&`) commonly introduced by hosting control panels like Hostinger hPanel.

---

## Environment Variables

Configure the following variables in `.env` or in Hostinger hPanel Environment Variables:

```env
# Shiprocket Logistics Integration
SHIPROCKET_EMAIL="your_shiprocket_api_email@domain.com"
SHIPROCKET_PASSWORD="your_shiprocket_api_password"
SHIPROCKET_PICKUP_LOCATION="warehouse"
SHIPROCKET_PICKUP_PINCODE="110030"
SHIPROCKET_CHANNEL_ID="11797508"

# Optional Auth Pause Switch (Set to true to pause outbound auth requests)
SHIPROCKET_AUTH_PAUSED="false"

# Database & Payment Credentials
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="your_razorpay_secret"
JWT_SECRET="your_secure_jwt_secret"
```

---

## Diagnostic & Outbound IP Endpoints

### 1. Hostinger Outbound Egress IP Detector
- **Endpoint**: `GET /api/shipping/outbound-ip`
- **Description**: Returns the server's exact outbound public IP address to whitelist in **Shiprocket Panel > Settings > API > Configure**.

### 2. Isolated Auth Diagnostic Endpoint
- **Endpoint**: `GET /api/shipping/sync-shiprocket?resetLockout=true&forceFresh=true`
- **Description**: Resets local circuit breaker backoff timers and forces a brand new HTTP `POST` login request to `https://apiv2.shiprocket.in/v1/external/auth/login` to test credentials and token issuance in isolation.

---

## Development & Build Commands

```bash
# Run local development server
npm run dev

# Generate Prisma Client & Run Next.js Production Build
npm run build

# Start Production Server
npm start
```
