import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./toolkit/store"
import "@fortawesome/fontawesome-pro/css/all.css"
import "bootstrap/dist/css/bootstrap.min.css"
import App from "./App"

const root = document.getElementById("root")!

createRoot(root).render(
	<Provider store={store}>
		<App />
	</Provider>
)
