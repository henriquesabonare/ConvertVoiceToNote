import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App/app'
import '../index.css'
import { Toaster } from 'sonner';

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
    <Toaster richColors  />
  </React.StrictMode>,
)
