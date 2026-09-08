# 🌱 Sustain

> Turning surplus into support — connecting Indian event organizers with NGOs to rescue food, reduce waste, and feed communities.

🔗 **Live Site:** 
https://sustainapp.netlify.app/
---

## 💡 Why I Built This

Every day, corporate events and gatherings across India generate huge amounts of surplus food that ends up wasted — while NGOs working to feed underserved communities often struggle to find reliable, real-time sources of donations. Sustain exists to close that gap: a simple, fast platform where event organizers can post surplus food the moment it's available, and verified NGOs can claim it instantly, turning waste into meals.

## 🎯 Vision

To build India's most trusted surplus-food recovery network — making food waste from events a thing of the past, one rescued meal at a time.

## ✨ Features

- 🌍 Interactive 3D rotating globe visualizing the recovery network across India
- 🤝 Dedicated dashboards for Organizers and NGOs
- 📡 Real-time surplus food feed — NGOs see and claim listings instantly
- 📊 Live impact tracking (meals saved, active hubs, recovery points)
- 🔐 Secure authentication with role-based profiles (Organizer / NGO)
- 🌗 Light and dark mode support
- 📱 Fully responsive design

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React Three Fiber, Tailwind CSS
- **Backend & Database:** Supabase (PostgreSQL, Auth, Row Level Security)
- **Design:** Google Stitch
- **Development:** Google Antigravity
- **Deployment:** Netlify 

## 🗄️ Database Structure

| Table | Purpose |
|---|---|
| `users` | Core user profiles, linked to Supabase Auth |
| `organizers` | Organizer-specific profile data |
| `ngos` | NGO-specific profile data and verification status |
| `events` | Events hosted by organizers |
| `surplus_listings` | Individual surplus food postings |
| `claims` | Records of NGOs claiming surplus listings |

## 🚀 Getting Started

```bash
git clone https://github.com/vedantsonareofficial/sustain.git
cd sustain
npm install
```

Create a `.env.local` file in the root with:
