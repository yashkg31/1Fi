import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RecoilRoot } from "recoil";
import App from './App.jsx'
import './index.css'
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
      <App />  
    </RecoilRoot>
  </StrictMode>,
)
