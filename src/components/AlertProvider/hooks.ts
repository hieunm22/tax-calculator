import { createContext, useContext } from "react"
import { AlertFn } from "./types"

export const AlertContext = createContext<AlertFn | null>(null)

export const useAlert = (): AlertFn => {
	const ctx = useContext(AlertContext)
	if (!ctx) throw new Error("useAlert must be used inside <AlertProvider />")
	return ctx
}
