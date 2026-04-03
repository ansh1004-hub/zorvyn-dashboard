# ZorvynDash - Finance Dashboard Interface

**Developed by:** [ANSH JAISWAL]

## 📌 Overview

This project is a responsive, interactive frontend dashboard built for the Zorvyn screening assessment. It focuses on clean architecture, modern state management, and intuitive data visualization.

## 🚀 Tech Stack & Architecture Decisions

- **Framework:** React + Vite (Chosen for lightning-fast HMR and optimized builds).
- **Styling:** Tailwind CSS (Allowed for rapid UI development and seamless responsive design without bulky CSS files).
- **Visualizations:** Recharts (Provides declarative, responsive, and highly customizable SVG charts).
- **Icons:** Lucide-React (Clean, modern iconography).

## ✨ Key Features

- **Dynamic Data Visualizations:** Real-time calculation of total balances, income, and expenses mapped to interactive Line and Doughnut charts.
- **Smart Filtering Engine:** Instant, case-insensitive search logic combined with categorical dropdown filters for the transactions table.
- **Simulated RBAC (Role-Based Access Control):** A toggleable global state that dynamically mounts/unmounts UI elements (like the 'Add New' button and delete actions) based on whether the active user is an 'Admin' or a 'Viewer'.
- **Responsive Design:** A fully mobile-responsive sidebar layout that adapts gracefully to smaller screens.

## 🛠️ Local Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
