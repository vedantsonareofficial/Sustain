# 🌱 Sustain

> Turning surplus into support.

Sustain is a digital food-recovery platform that connects event organizers with verified NGOs to help recover surplus food before it goes to waste.

Event organizers can post available surplus food in real time, while verified NGOs can discover and claim suitable donations for distribution to communities in need.

🔗 **Live Site:** 
https://sustainapp.netlify.app/
---

## 🎯 The Problem

Large events, corporate gatherings, weddings, conferences, and other occasions can generate significant amounts of surplus food.

At the same time, NGOs and community organizations may need reliable sources of food donations.

The problem is often not simply a lack of food — it is the lack of a fast, reliable connection between surplus food and organizations that can distribute it.

Sustain aims to bridge that gap.

Instead of surplus food becoming waste:

Event → Surplus Food → Sustain → Verified NGO → Community


## 💡 Our Solution

Sustain provides a centralized platform where:

- Organizers can quickly publish available surplus food.
- Verified NGOs can discover available donations.
- NGOs can claim suitable food listings.
- Both sides can track the recovery process.
- Platform-level impact can be monitored through recovery metrics.

The goal is to make surplus-food recovery faster, more organized, and more transparent.

## 🎯 Vision

To build a trusted surplus-food recovery network where usable food can reach communities instead of becoming waste.





## ⚙️ How Sustain Works

### 1. 📅 Organizer Creates a Listing

An event organizer posts information about available surplus food, including relevant details about quantity, location, and availability.

### 2. 📡 NGOs Discover Available Food

Verified NGOs can view available surplus-food listings through their dashboard.

### 3. 🤝 NGO Claims the Donation

An eligible NGO claims a suitable listing and coordinates the recovery process.

### 4. 🚚 Food Is Recovered

The NGO collects the available surplus food and takes responsibility for its distribution.

### 5. 📊 Impact Is Recorded

The platform tracks recovery activity and converts it into measurable impact data.

### The Recovery Loop

**EVENT → SURPLUS → LISTING → NGO CLAIM → RECOVERY → COMMUNITY → IMPACT**



## ✨ Key Features

### 🤝 Two-Sided Platform

Dedicated experiences for **Food Organizers** and **NGOs**.

### 📡 Real-Time Food Listings

Organizers can publish available surplus food and NGOs can discover current opportunities.

### 🎯 Claim-Based Recovery

NGOs can claim available surplus-food listings through the platform.

### 📊 Impact Tracking

Track recovery activity through platform-level impact metrics.

### 🔐 Role-Based Authentication

Secure authentication with separate Organizer and NGO profiles.

### 🌍 Recovery Network Visualization

Interactive 3D visualization representing the growing recovery network.

### 🌗 Modern User Experience

Light and dark mode with a responsive interface across devices.

### 📱 Responsive Design

Designed to work across desktop, tablet, and mobile screen sizes.
## 👥 Who Is Sustain For?

### 🏢 Food Organizers

Organizations and individuals that regularly host events and may have usable surplus food.

Examples can include:

* Corporate events
* Conferences
* Weddings
* College events
* Large gatherings
* Event organizers and caterers

### 🤲 NGOs & Community Organizations

Verified organizations capable of collecting and distributing recovered food to communities.

### 🤝 Future Ecosystem Partners

As the network grows, Sustain can potentially work with:

* Event-management companies
* Catering companies
* Corporate CSR teams
* Community organizations
* Food-recovery partners

## 💰 Business Model

Sustain is designed around a scalable B2B and partnership-driven model.

### Potential Revenue Streams

**1. Organizer Subscriptions**

Frequent event organizers can access premium tools, analytics, and recovery management features through subscription plans.

**2. Enterprise Partnerships**

Larger organizations can use Sustain for structured surplus-food recovery and impact tracking.

**3. CSR & Impact Partnerships**

Companies can partner with Sustain to support measurable food-recovery initiatives and track their social impact.

**4. Platform Services**

Additional operational or recovery services can be introduced as the network scales.

> **Current Status:** These represent the planned business model and future monetization opportunities, not necessarily current revenue.

## 🛠️ Tech Stack

| Layer              | Technology                  |
| ------------------ | --------------------------- |
| Frontend           | Next.js 14, React           |
| 3D Visualization   | React Three Fiber           |
| Styling            | Tailwind CSS                |
| Backend & Database | Supabase / PostgreSQL       |
| Authentication     | Supabase Auth               |
| Security           | Supabase Row Level Security |
| Design             | Google Stitch               |
| Development        | Google Antigravity          |
| Deployment         | Vercel                      |



## 🗄️ Database Architecture

Sustain uses a relational PostgreSQL database through Supabase, with separate entities for users, organizations, events, food listings, and recovery claims.

| Table              | Purpose                                    |
| ------------------ | ------------------------------------------ |
| `users`            | Core user profiles linked to Supabase Auth |
| `organizers`       | Organizer-specific profile data            |
| `ngos`             | NGO profiles and verification status       |
| `events`           | Events created by organizers               |
| `surplus_listings` | Individual surplus-food postings           |
| `claims`           | Records of NGOs claiming surplus listings  |

## 🎥 Demo

### 🌐 Live Application

**Sustain:** https://sustainapp.netlify.app/

### 🔗 Repository

**GitHub:** https://github.com/vedantsonareofficial/Sustain

### 📸 Product Preview

Add screenshots here showing:

1. Landing page <img width="1917" height="968" alt="Screenshot 2026-09-21 220451" src="https://github.com/user-attachments/assets/49641094-98b7-4aba-96ee-ae16a7f720de" />

2. Organizer dashboard <img width="1917" height="963" alt="Screenshot 2026-09-21 221409" src="https://github.com/user-attachments/assets/c575a8c0-0caa-4ded-b3ab-37383eabceec" />

3. NGO dashboard<img width="1917" height="968" alt="Screenshot 2026-09-21 221102" src="https://github.com/user-attachments/assets/e0639124-70b3-4add-a783-487d92752c9b" />

4. Surplus-food listing <img width="442" height="617" alt="Screenshot 2026-09-21 221802" src="https://github.com/user-attachments/assets/e66fec21-862c-4929-8c55-c435c92071c7" />


5. Sign in page <img width="1917" height="966" alt="Screenshot 2026-09-21 220908" src="https://github.com/user-attachments/assets/4ba939fc-8149-42b1-8fb4-ac47d85bf9a4" />



## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git
* A Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/vedantsonareofficial/Sustain.git
cd sustain
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

Add the environment variables required by your Supabase configuration.

```env
# Add your Supabase environment variables here
```

> Use the exact environment-variable names required by the current application code.

### 4. Start the development server

```bash
npm run dev
```

Open the local development URL shown in your terminal.

### 5. Build for production

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

## 🗺️ Roadmap

### Phase 1 — Current

* Organizer and NGO onboarding
* Surplus-food listings
* NGO claim system
* Role-based dashboards
* Impact tracking
* Authentication

### Phase 2 — Network Expansion

* Location-based matching
* Improved verification workflows
* Notifications
* Advanced impact analytics
* Recovery history

### Phase 3 — Scale

* Enterprise partnerships
* CSR integrations
* Event-management integrations
* Automated matching
* Expansion to more cities across India

> Roadmap items represent planned development and may change as the platform evolves.
