import './App.css'

import { createMuiTheme, CssBaseline, MuiThemeProvider } from '@material-ui/core'
import React, { useMemo } from 'react'

import { Dashboard } from './scenes/Dashboard'

function App() {
	const theme = useMemo(
		() =>
			createMuiTheme({
				palette: {
					type: 'dark'
				}
			}),
		[]
	)

	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<Dashboard />
		</MuiThemeProvider>
	)
}

export default App
