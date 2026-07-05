# Premium Digital Wedding Invitation 💍

A high-end, responsive digital wedding invitation website built for Alexander & Eleanor. 
The design features a luxurious editorial layout with a dreamy forest atmosphere, smooth cinematic transitions, and a unique desktop-preview architecture.

## 🌟 Key Features

- **Mobile-First Design**: The core invitation is designed for a 393px mobile canvas, ensuring a perfect experience on smartphones.
- **Desktop Preview Architecture**: On desktop screens, the mobile invitation is presented elegantly within a centered phone container over a blurred cinematic background, maintaining the integrity of the design without awkward stretching.
- **Smooth Scrolling**: Integrated with [Lenis](https://lenis.studiofreight.com/) for a fluid, premium scrolling experience.
- **Cinematic Animations**: Subtle, elegant animations (fade, translate, scale) to enhance the storytelling without overwhelming the user.
- **Premium Typography**: Utilizes elegant serif (Cormorant Garamond) and clean sans-serif (Montserrat) fonts.

## 🚀 Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) & CSS Keyframes
- **Scrolling**: Lenis
- **Icons**: Lucide React & React Icons
- **Language**: TypeScript

## 🛠️ Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `app/`: Next.js App Router files (pages, layouts, global styles).
- `components/`: Reusable React components.
  - `layout/`: Core layout components (e.g., `DesktopPreview.tsx`).
  - `splash-screen/`: First impression components (e.g., `HeroBackground.tsx`).
  - `providers/`: React context providers (e.g., Lenis smooth scrolling).
- `public/images/`: Optimized static images exported from Figma.

## 🎨 Design Rules

This project strictly follows the provided Figma design as the single source of truth. 
- **Colors**: Sage Green, Olive Green, Ivory, Warm Cream, Dusty Beige, Soft Brown.
- **Assets**: All images are pre-optimized. No resizing, cropping, or aspect ratio changes are permitted.

---
*Built with ❤️ for Alexander & Eleanor.*
