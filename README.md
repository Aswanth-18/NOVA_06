# SkillSync - Official BIT Student Peer Mentorship Ecosystem

![SkillSync](https://via.placeholder.com/1200x600.png?text=SkillSync+-+BIT+Peer+Mentorship)

**SkillSync** is a premium, glassmorphic React dashboard web application tailored for the Bannari Amman Institute of Technology (BIT). It functions as a robust peer-to-peer mentorship ecosystem. Students can find faculty-verified peer mentors, book learning sessions, teach their skills, and level up their student credentials.

This project is a modern, responsive frontend single-page application built using Vite, CSS, React, and Lucide Icons.

## ✨ Features
- **Premium UI/UX:** Clean, dark-mode focused glassmorphic design architecture with smooth micro-interactions.
- **BIT-Tailored Experience:** Domain-specific (CSE, IT, ECE, AI & DS) dummy data covering core competencies like Java Programming, DSA, DBMS, and Aptitude.
- **Student Mentorship System:** Fully fleshed-out views for student roles as mentors and mentees.
- **Skill Market:** Explore skills, see mentor recommendations, and reserve peer coaching sessions.
- **Role-Based Views:**
  - **Student Dashboard:** Track XP, see notifications, view schedule.
  - **Leaderboard:** Track highest-rated mentors and students on campus.
  - **Messages Interface:** Integrated, real-time messaging UI mockups.
  - **Faculty Assessment Board:** Faculty dashboard UI to evaluate mentor applications.

## 💻 Tech Stack
- **Framework:** React.js (Vite)
- **Styling:** Custom Vanilla CSS (Modern CSS variables, Flexbox/Grid) with TailwindCSS classes injected directly where applicable.
- **Icons:** Lucide-React
- **Routing:** Component-based internal lightweight routing (Context-driven)

## 📂 Folder Structure

```text
SkillSync/
├── public/                 # Static public assets (Favicons, etc.)
├── src/                    # Source code
│   ├── components/         # Reusable UI library (Avatars, Cards, Navigation, Inputs)
│   ├── context/            # Shared state context providers
│   ├── pages/              # Application views based on function
│   │   ├── admin/          # Admin reporting views
│   │   ├── auth/           # Login/Signup forms
│   │   ├── booking/        # Session booking workflows
│   │   ├── dashboard/      # Primary Student Hub layout
│   │   ├── faculty/        # Faculty coordination interfaces
│   │   ├── landing/        # Unauthenticated landing page & sections
│   │   ├── leaderboard/    # Campus leaderboards
│   │   ├── marketplace/    # Browse skills & subjects
│   │   ├── mentor/         # Specific mentor profile view
│   │   ├── messages/       # In-app chat interface
│   │   ├── profile/        # Self profile management
│   │   └── settings/       # Account configuration
│   ├── App.jsx             # Root layout and client routing definitions
│   ├── index.css           # Global theme variables, utility classes, animations
│   └── main.jsx            # Application entry point
├── .env.example            # Environment variables template
├── .gitignore              # Ignored files for source control
├── LICENSE                 # Open source MIT license
├── package.json            # Project dependencies and script declarations
├── README.md               # Project documentation
└── vite.config.js          # Build tool configurations
```

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd SkillSync
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables (Optional):**
   Copy the example environment file and customize as needed:
   ```bash
   cp .env.example .env
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
