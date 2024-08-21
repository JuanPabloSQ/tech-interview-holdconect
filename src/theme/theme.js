import { lightBlue } from '@mui/material/colors';

const baseTheme = {
  primary: {
    main: lightBlue[600],
  },
};

const getTheme = (mode) => ({
  palette: {
    ...baseTheme,
    mode,
    ...(mode === 'light'
      ? {
        }
      : { 
        }),
  },
});

export default getTheme;
