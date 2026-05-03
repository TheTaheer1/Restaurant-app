# Saffron & Smoke 🌿

A premium, highly responsive luxury restaurant web application built with React, Vite, and Framer Motion. 

## 🌟 Features

- **Dynamic Landing Page**: Beautiful scroll-reveal animations using Framer Motion with optimized mobile-trigger margins.
- **Interactive Menu**: Categorized, responsive menu display with elegant hover effects and spice-level indicators.
- **Cart & Checkout Flow**: Full front-end cart management with global state via React Context API, leading to a multi-step checkout form.
- **User Profile Dashboard**: Controlled React forms for managing user profile details, along with a dynamic order-history timeline.
- **Admin Panel**: Role-gated mock administrative dashboard to oversee platform metrics.
- **Responsive Navigation**: Adaptive mobile drawer navigation, fixing standard React-Router scroll behaviors, and strictly enforcing viewport boundaries.
- **Rich Aesthetics**: Custom-crafted CSS tokens for a luxurious dark-mode color palette (`--brown-darkest`, `--e8a84c` accents).

## 🚀 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **Animations**: Framer Motion
- **Styling**: Vanilla CSS Modules & CSS Variables

## 🛠 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TheTaheer1/Restaurant-app.git
   ```

2. **Navigate to the directory:**
   ```bash
   cd Restaurant-app
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📱 Mobile Polish

A significant amount of effort went into making this app perfect on mobile:
- **Strict Viewport Containment**: Root `overflow-x: hidden` to prevent layout breaking on iOS/Android.
- **Dynamic Flex Resizing**: Media queries rigorously test for flex container bounds to ensure no icons (like the Hamburger menu) are cut off.
- **Intelligent Page Routing**: Custom `window.scrollTo(0, 0)` transition logic implemented so navigating on long mobile lists resets correctly.
