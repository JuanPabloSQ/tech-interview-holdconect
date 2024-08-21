import { ThemeContextProvider } from './context/ThemeContext';
import ToggleColorMode from './components/ToggleColorMode';
import { SnackbarContextProvider } from './context/SnackbarContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TableStreet from './components/TableStreet';

function App() {

  return (
    <ThemeContextProvider>
      <SnackbarContextProvider>
        <>
          <Box sx={{ textAlign: 'center' }}>
            <ToggleColorMode/>
            <Typography variant="h3" gutterBottom> Tech Interview Holdconet</Typography>
            <TableStreet/>
          </Box>
        </>
      </SnackbarContextProvider>
    </ThemeContextProvider>
  )
}

export default App
