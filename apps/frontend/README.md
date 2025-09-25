# High-Security Authentication Project

This project is a **secure authentication system** built with high-level security in mind. It uses **Access Token** and **Refresh Token** for authentication and implements an **OTP-based system** (codes sent via email) for enhanced security.

---

## Features

- **Access & Refresh Token-based Authentication**  
- **OTP-based email verification** for secure user authentication  
- High-level security following best practices for token management  
- Built with **Redux Toolkit** and **RTK Query** for state management and API calls  
- **Feature-based folder structure** for easy maintenance and scalability  

---

## Technologies & Dependencies

- [React](https://reactjs.org/)  
- [Typescript](https://www.typescriptlang.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [React Hook Form](https://react-hook-form.com/)  
- [Redux Toolkit](https://redux-toolkit.js.org/)  
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)  
- [Zod](https://zod.dev/)  
- [React Icons](https://react-icons.github.io/react-icons/)  
- [Sonner](https://sonner.vercel.app/)  

---

## Project Structure

The project uses a **feature-based folder structure**, which means each major feature of the application has its own folder. This approach helps in organizing code by functionality, making it easier to maintain and scale.

```
src/
├── features/ # All feature-specific code (components, hooks, slices, etc.)
├── lib/ # Shared libraries, API hooks, utils
├── components/ # Reusable UI components
├── store/ # Redux store setup
└── App.jsx # Main entry point
```

---

## Installation

1. Clone the repository:  
```bash
git clone https://github.com/ShahinFallah/authentication.git
cd authentication/apps/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```
