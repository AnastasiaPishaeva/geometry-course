import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
<<<<<<< HEAD
import App from './app/App.tsx'
import {BrowserRouter} from "react-router-dom";
=======
import {App} from './app/App.tsx'
>>>>>>> 48a4db90 (fix accordion)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </StrictMode>,
)
