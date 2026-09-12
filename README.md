[CASHXCHANGE-README.md](https://github.com/user-attachments/files/32138916/CASHXCHANGE-README.md)
# CASHXCHANGE 💸

> **A peer-to-peer cash access marketplace prototype with one account, two roles, a demo wallet, OTP-secured transactions, dual reputation, privacy controls, and receiver commission simulation.**

CASHXCHANGE is a **demo/MVP web application** built to explore a peer-to-peer model where a user can either request physical cash as a **Sender** or provide physical cash as a **Receiver**. Both roles use the same account and interface.

The project focuses on the user experience, transaction lifecycle, wallet/ledger simulation, privacy, reputation, dispute handling, and admin controls. **It does not process real money.**

---

## 🚨 Important Disclaimer

**CASHXCHANGE is a prototype/demo application. No real financial transaction takes place.**

The current project uses a client-side mock backend and simulated data. It is **not** connected to a real bank, UPI network, payment gateway, KYC provider, or cash-withdrawal service.

Although the prototype contains UPI-themed top-up/QR interfaces for demonstration, these flows are simulated and do not perform a real payment.

A real-money version would require an appropriate regulated financial/payment-partner architecture, security controls, KYC/AML processes, legal review, and applicable regulatory approvals before launch.

---

## ✨ What the Project Does

CASHXCHANGE combines four main ideas:

- **One account, two roles** — the same user can act as Sender or Receiver.
- **Nearby matching** — Senders can discover nearby available Receivers without exposing their wallet balance.
- **Demo wallet + ledger** — balances, fees, commission, credits, deductions, and refunds are simulated.
- **Dual reputation** — Sender and Receiver ratings are tracked separately.

### Simple concept

```text
                 ONE USER ACCOUNT
                        │
             ┌──────────┴──────────┐
             │                     │
          SENDER                RECEIVER
             │                     │
      Needs physical cash    Provides physical cash
             │                     │
             └──────────┬──────────┘
                        │
                 Nearby matching
                        │
                 Private request
                        │
                 Accept / Decline
                        │
                 Demo wallet flow
                        │
                 OTP verification
                        │
                  Cash handover
                        │
                   COMPLETED
                    /        \
          Sender rating    Receiver rating
```

---

## 🏠 Main User Experience

The home experience is intentionally simple and centered around two actions:

### Sender Request

A user who needs cash can:

1. Enter the amount required.
2. View nearby available Receivers.
3. See public trust information such as name, verification, rating, and broad distance.
4. Send a private request to a selected Receiver.
5. Follow the transaction through acceptance, OTP verification, and cash confirmation.
6. Rate the Receiver after completion.

### Receiver Request

A user who wants to provide cash can:

1. Turn Receiver availability on.
2. Receive incoming requests from nearby Senders.
3. View the requested amount and the Sender's reputation.
4. Accept or decline the request.
5. Complete the demo transaction.
6. Earn a simulated receiver commission.
7. Rate the Sender after completion.

---

## 💰 Demo Wallet & Ledger

The project includes a simulated wallet and transaction ledger. It supports demo entries such as:

- Opening balance
- Demo fund deposits
- Sender deductions
- Receiver credits
- Receiver commission
- Platform fee
- Refunds
- Simulated UPI top-up entries

Example demo accounting:

```text
Cash amount:              ₹2,000
Service fee:                 ₹20
Sender total deduction:   ₹2,020

Receiver commission:         ₹10
Platform fee:                ₹10
```

The wallet balance and financial history are private to the user.

### Important implementation detail

The transaction state is controlled by the mock backend rather than allowing the UI to simply mark a transaction as completed. This prototype models a state-driven flow with backend-side validation logic.

---

## 🔐 OTP & Transaction Lifecycle

The mock backend supports a transaction lifecycle including:

```text
CREATED
  ↓
REQUESTED
  ↓
ACCEPTED
  ↓
READY_FOR_MEETING
  ↓
OTP_VERIFICATION
  ↓
SETTLEMENT_PROCESSING
  ↓
CASH_CONFIRMATION
  ↓
COMPLETED
```

Other supported states include:

```text
DECLINED
CANCELLED
EXPIRED
FAILED
DISPUTED
```

A random six-digit demo OTP is generated for the simulated verification step.

---

## ⭐ Dual Rating System

CASHXCHANGE keeps **separate reputation scores** for each role.

### Sender Rating

Measures the user's reliability when acting as a Sender.

```text
Sender Rating:  ⭐ 4.8
Completed:       84
Success Rate:    98.7%
```

### Receiver Rating

Measures reliability when acting as a Receiver.

```text
Receiver Rating: ⭐ 4.9
Completed:        112
Success Rate:     99.2%
```

A user can therefore have different reputations for the two roles.

Ratings are tied to completed transactions and the role being rated.

---

## 🛡️ Privacy by Design

Nearby users should not expose sensitive financial information.

### Publicly visible

- Name
- Profile photo
- Verification status
- Sender rating / Receiver rating
- Completed transaction counts
- Broad distance
- Availability

### Kept private

- Wallet balance
- Bank/funding information
- Earnings
- Detailed financial history
- Unrelated transaction amounts

The repository also includes privacy settings such as location obfuscation, profile visibility, balance hiding, and social-profile visibility.

---

## 💵 Receiver Commission

Receivers earn simulated commission after a successful transaction.

The project contains configurable demo commission settings in the admin portal, including:

- Receiver commission percentage
- Platform fee percentage
- Base service fee percentage
- Minimum service fee

Example:

```text
Service fee: ₹20
Receiver share: 50% → ₹10
Platform share: 50% → ₹10
```

These are **demo values only**.

---

## 📱 Features Included in the Current Repository

### Core

- One account with Sender/Receiver roles
- Home dashboard
- Wallet screen
- Transaction history
- Profile screen
- Nearby/availability simulation
- Sender request flow
- Receiver request flow
- Active transaction modal
- OTP verification
- Cash handover confirmation
- Cancellation flow
- Demo commission calculation

### Trust & Safety

- Separate Sender and Receiver ratings
- Social trust profile section
- Privacy settings
- Safety tips
- Terms & policies modal
- Dispute reporting
- Admin dispute resolution
- User suspension controls
- Notification system

### Wallet / QR / Demo Funding

- Demo wallet
- Demo fund top-up
- Simulated UPI top-up interface
- Receive QR code modal
- QR scanner modal
- Demo ledger entries
- Transaction receipts/history

### Customization

- Multiple themes
- Theme selector
- Light mode
- Emerald theme
- Amber theme
- Indigo theme
- Slate theme

### Administration

- Admin dashboard
- User management
- Transaction audit view
- Commission settings
- Dispute management
- Demo metrics
- User suspension / activation
- Demo-data reset

---

## 🧩 Project Structure

```text
CASHXCHANGE-main/
├── src/
│   ├── components/
│   │   ├── AdminDashboard.tsx
│   │   ├── BottomNav.tsx
│   │   ├── DisputeModal.tsx
│   │   ├── Header.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── NotificationsModal.tsx
│   │   ├── OnboardingModal.tsx
│   │   ├── PrivacySettingsModal.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── QRScannerModal.tsx
│   │   ├── RatingModal.tsx
│   │   ├── ReceiveQRModal.tsx
│   │   ├── ReceiverFlowModal.tsx
│   │   ├── SafetyTipsModal.tsx
│   │   ├── SenderFlowModal.tsx
│   │   ├── SocialTrustModal.tsx
│   │   ├── TermsPoliciesModal.tsx
│   │   ├── ThemeSelectorModal.tsx
│   │   ├── TransactionActiveModal.tsx
│   │   ├── TransactionsScreen.tsx
│   │   ├── UpiTopUpModal.tsx
│   │   └── WalletScreen.tsx
│   │
│   ├── context/
│   │   └── AppContext.tsx
│   │
│   ├── data/
│   │   └── mockData.ts
│   │
│   ├── services/
│   │   └── mockBackend.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── .env.example
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Tech Stack

### Frontend

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS 4 / Tailwind Vite plugin**
- **Lucide React** for icons
- **Motion** for UI animation

### Demo Data / State

- React Context API
- Local mock backend
- LocalStorage persistence
- Mock users, wallets, transactions, ratings, notifications, and disputes

### Supporting packages

- Express
- dotenv
- `@google/genai`

> The current repository's primary transaction engine is the local `mockBackend` service; it is not a production server-side payment backend.

---

## 🚀 Getting Started

### Prerequisites

Install:

- Node.js (LTS recommended)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/CASHXCHANGE.git
cd CASHXCHANGE
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The project is configured to use Vite on port `3000`.

Open:

```text
http://localhost:3000
```

### 4. Production build

```bash
npm run build
```

### 5. Type-check / lint

```bash
npm run lint
```

### 6. Preview a production build

```bash
npm run preview
```

---

## 🔑 Environment Variables

The repository contains an `.env.example` file.

Current example variables include:

```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
```

Only configure credentials that are actually required by the feature you are running. **Never commit real secrets or API keys to GitHub.**

---

## 🧪 Demo Accounts & Mock Data

The project includes pre-seeded demo data in:

```text
src/data/mockData.ts
```

The application also supports switching between demo accounts from the profile area, making it possible to test Sender and Receiver flows without creating real users.

The mock backend stores demo state in browser LocalStorage using the key:

```text
cashconnect_demo_state_v3
```

A demo-data reset action is also available from the application/admin controls.

---

## 🧠 Architecture Overview

```text
React UI
   │
   ▼
AppContext
   │
   ▼
MockBackendService
   │
   ├── Users
   ├── Wallets
   ├── Ledger
   ├── Transactions
   ├── Ratings
   ├── Notifications
   └── Disputes
           │
           ▼
      LocalStorage
```

### Main application flow

```text
App.tsx
  │
  ├── Header
  ├── BottomNav
  ├── HomeScreen
  ├── WalletScreen
  ├── TransactionsScreen
  ├── ProfileScreen
  └── AdminDashboard
        │
        └── Modal-based transaction flows
```

---

## 🗃️ Core Data Model

The project defines typed models for the main domain objects.

### User

```ts
User {
  id
  name
  phone
  email
  verified
  senderRating
  receiverRating
  senderCompleted
  receiverCompleted
  senderSuccessRate
  receiverSuccessRate
  availability
  distanceKm
  privacySettings
}
```

### Wallet

```ts
Wallet {
  id
  userId
  balance
  updatedAt
}
```

### Transaction

```ts
Transaction {
  id
  senderId
  receiverId
  amount
  serviceFee
  receiverCommission
  platformFee
  status
  otp
  otpVerified
  senderHandoverConfirmed
  receiverHandoverConfirmed
  timeline
}
```

### Rating

```ts
Rating {
  transactionId
  fromUserId
  toUserId
  role
  rating
  review
}
```

---

## 🧾 Transaction & Wallet Safety in the Prototype

The mock backend models financial operations using explicit ledger entries rather than only changing a UI balance.

Supported ledger types include:

```text
OPENING_BALANCE
SENDER_DEDUCTION
RECEIVER_CREDIT
RECEIVER_COMMISSION
PLATFORM_FEE
DEPOSIT_DEMO_FUNDS
DEPOSIT_UPI
REFUND
```

This gives the prototype a clearer accounting trail and makes it easier to replace the simulated financial layer with a properly designed backend later.

---

## ⚙️ Admin Dashboard

The repository includes an admin management portal with tabs for:

- Overview
- Users
- Transactions
- Commission Settings
- Disputes

It provides demo metrics such as transaction volume and commissions, plus tools for:

- Auditing transactions
- Reviewing users
- Updating commission settings
- Managing disputes
- Suspending/activating users

---

## 🧰 Current Prototype Limitations

This project is intentionally a prototype. Among the main limitations:

- Data is mock/local rather than a production database.
- Wallet operations are simulated.
- UPI-related screens are demo interfaces only.
- OTP is simulated in the mock backend.
- Location is simulated rather than a production geolocation/matching service.
- No real KYC/AML workflow is implemented.
- No production payment settlement or custody layer is implemented.
- No production-grade fraud/risk engine is implemented.
- No production authentication/authorization service is implemented.

---

## 🗺️ Roadmap

### Phase 1 — Prototype ✅

- [x] One account / two roles
- [x] Sender flow
- [x] Receiver flow
- [x] Demo wallet
- [x] Ledger simulation
- [x] OTP flow
- [x] Cash handover confirmation
- [x] Separate Sender / Receiver ratings
- [x] Receiver commission simulation
- [x] Notifications
- [x] Disputes
- [x] Admin dashboard
- [x] Privacy & safety controls
- [x] Theme customization

### Phase 2 — Engineering Improvements

- [ ] Production database architecture
- [ ] Real authentication and session management
- [ ] Server-side API layer
- [ ] Real-time request updates
- [ ] Secure transaction authorization
- [ ] Production location/matching service
- [ ] Stronger audit logging
- [ ] Automated testing
- [ ] Monitoring and error reporting

### Phase 3 — Production Research

- [ ] Regulatory analysis
- [ ] Regulated financial/payment partner
- [ ] KYC/AML architecture
- [ ] Production payment/wallet integration
- [ ] Fraud/risk monitoring
- [ ] Production-grade security review
- [ ] Compliance and legal review

<img width="437" height="732" alt="Screenshot 2026-09-12 122511" src="https://github.com/user-attachments/assets/db570d53-8b1a-4e30-bc13-055670214b80" />
<img width="460" height="722" alt="Screenshot 2026-09-12 122519" src="https://github.com/user-attachments/assets/58061b83-a383-453f-8494-4374a200ed25" />
<img width="451" height="746" alt="Screenshot 2026-09-12 122533" src="https://github.com/user-attachments/assets/a42c285a-abf4-42cd-a8a0-99e62361c097" />
<img width="446" height="757" alt="Screenshot 2026-09-12 122543" src="https://github.com/user-attachments/assets/2db35b7b-82f6-41f8-bbcd-3cc0f9e3a037" />
<img width="441" height="750" alt="Screenshot 2026-09-12 122553" src="https://github.com/user-attachments/assets/6191d789-9d97-421b-bdf9-513a0c6e4967" />
<img width="452" height="732" alt="Screenshot 2026-09-12 122607" src="https://github.com/user-attachments/assets/2581709c-0d06-4da3-96ea-3f516758a8e7" />
<img width="437" height="662" alt="Screenshot 2026-09-12 122622" src="https://github.com/user-attachments/assets/6f99af04-c358-41bb-a86a-339a78896acb" />
<img width="458" height="691" alt="Screenshot 2026-09-12 122642" src="https://github.com/user-attachments/assets/83c0acd8-4c0e-49c0-aaab-5e988034c645" />
<img width="435" height="675" alt="Screenshot 2026-09-12 122703" src="https://github.com/user-attachments/assets/01234f97-3e7c-4a58-b6bb-fc748ec5210f" />


## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run the project and test the flow.
5. Commit your changes.
6. Open a Pull Request.

Example:

```bash
git checkout -b feature/your-feature
npm install
npm run dev
```

---

## 📄 License

No license is currently specified in the repository.

If you plan to make the project open source, add an appropriate `LICENSE` file (for example, MIT) and update this section.

---

## 👨‍💻 Project Status

**Status: 🚧 Active Prototype / MVP**

CashConnect is currently focused on demonstrating the product concept, interaction design, transaction state machine, wallet/ledger simulation, privacy model, reputation system, commission logic, and admin workflows.

---

## ⭐ Why CashConnect?

The project explores a simple question:

> **What if someone needs physical cash nearby, but doesn't have convenient access to an ATM or cash-out point?**

CashConnect prototypes a trusted peer-to-peer experience around that problem while keeping financial information private and giving each user separate reputation for their Sender and Receiver roles.

---

**CashConnect — Find trusted cash nearby.**
