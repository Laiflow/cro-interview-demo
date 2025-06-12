import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import routes from '@/routes'

import '@/styles/tailwind.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/config/queryClient'

const container = document.getElementById('app')
if (!container) throw new Error('Failed to find the root element')
const root = createRoot(container)

root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>{routes}</QueryClientProvider>
  </BrowserRouter>
)
