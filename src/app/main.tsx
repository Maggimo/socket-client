import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppRoutes } from './routes.tsx'
import './styles/global.css'

const container: HTMLElement = document.getElementById('root')!
const root = createRoot(container)

root.render(
	<Router>
		<AppRoutes/>
	</Router>,
)
