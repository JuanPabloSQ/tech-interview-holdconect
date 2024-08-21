import { ThemeContextProvider } from './context/ThemeContext';
import ToggleColorMode from './components/ToggleColorMode';
import { SnackbarContextProvider } from './context/SnackbarContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function App() {

  return (
    <ThemeContextProvider>
      <SnackbarContextProvider>
        <>
          <Box sx={{ textAlign: 'center' }}>
            <ToggleColorMode/>
            <Typography variant="h3" gutterBottom> Tech Interview Holdconet</Typography>
          </Box>
        </>
      </SnackbarContextProvider>
    </ThemeContextProvider>
  )
}

export default App
