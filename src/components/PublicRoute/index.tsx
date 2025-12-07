import { Outlet } from "react-router-dom"
import Navbar from "../NavBar"

const PublicRoute = () => (
	<>
		<Navbar />
		<Outlet />
	</>
)

export default PublicRoute
