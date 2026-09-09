import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';


createRoot(document.getElementById('root')!).render(
  <ClerkProvider
    publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);





