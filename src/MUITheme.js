import {createTheme} from '@mui/material'
const theme = createTheme({
	palette: {
		mode: "dark",                        // switches all MUI components to dark
		background: {
			default: "#0f1117",                // main bg
			paper: "#1a1d27",                  // cards, surfaces
		},
		primary: {
			main: "#818cf8",                   // your purple accent
		},
		divider: "#2e3250",
	},
	typography: {
		fontFamily: "'Inter', sans-serif",
	},
});
export default theme;