import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme, CssBaseline, useMediaQuery } from '@mui/material'
import './index.css'
import App from './App.jsx'

function Root() {
  // prefer light by default, but follow system if user prefers dark
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#667eea' },
      secondary: { main: '#764ba2' },
      background: { default: '#ffffff', paper: '#ffffff' },
      text: { primary: '#213547' },
    },
    typography: { fontFamily: 'Roboto, Arial, sans-serif' },
  })

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#667eea' },
      secondary: { main: '#764ba2' },
      background: { default: '#121212', paper: '#1e1e1e' },
      text: { primary: 'rgba(255,255,255,0.87)' },
    },
    typography: { fontFamily: 'Roboto, Arial, sans-serif' },
  })

  const theme = prefersDark ? darkTheme : lightTheme

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
