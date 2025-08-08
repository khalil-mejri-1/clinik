import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />

  </StrictMode>,
)
