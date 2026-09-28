import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { registerSW } from "virtual:pwa-register"
import { store } from "./toolkit/store"
import "@fortawesome/fontawesome-free/css/fontawesome.min.css"
import "@fortawesome/fontawesome-free/css/solid.min.css"
import "bootstrap/dist/css/bootstrap.min.css"
import App from "./App"

registerSW({ immediate: true })

const root = document.getElementById("root")!

createRoot(root).render(
	<Provider store={store}>
		<App />
	</Provider>
)
