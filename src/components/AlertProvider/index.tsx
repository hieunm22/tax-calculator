import React, { createContext, useContext, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AlertFn, AlertModalProps, AlertRequest } from "./types"
import { TButton, TSpan, TTypography } from "../TranslationTag"
import { translate } from "locales/translate"
import "./AlertProvider.scss"
import { Dialog, DialogContent, DialogTitle, Divider, Typography } from "@mui/material"
import TranslationText from "../TranslationText"

const AlertContext = createContext<AlertFn | null>(null)

export const useAlert = (): AlertFn => {
	const ctx = useContext(AlertContext)
	if (!ctx) throw new Error("useAlert must be used inside <AlertProvider />")
	return ctx
}

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [current, setCurrent] = useState<AlertRequest | null>(null)
	const queueRef = useRef<AlertRequest[]>([])

	const showNext = () => {
		if (!current && queueRef.current.length > 0) {
			const next = queueRef.current.shift()!
			setCurrent(next)
		}
	}

	const alert: AlertFn = (message, options) =>
		new Promise<void>(resolve => {
			queueRef.current.push({ message, options, resolve })
			showNext()
		})

	const handleClose = () => {
		if (current) {
			current.resolve()
			setCurrent(null)
			showNext()
		}
	}

	return (
		<AlertContext.Provider value={alert}>
			{children}
			{current &&
				createPortal(
					<AlertModal
						open={Boolean(current)}
						title={current.options?.title ?? "home.alert.title"}
						message={current.message}
						onClose={handleClose}
					/>,
					document.body
				)}
		</AlertContext.Provider>
	)
}

const AlertModal: React.FC<AlertModalProps> = (props: AlertModalProps) => {
	const { open, message, title, onClose } = props
	return (
		<Dialog
			open={open}
			role="dialog"
			aria-modal="true"
			id="alert-modal"
			className="overlay"
		>
			<DialogTitle>
				<TSpan className="title" content={title} />
			</DialogTitle>
			<DialogContent>
				<TTypography className="message" variant="body1" content={message} />
				<div className="actions">
					<TButton autoFocus onClick={onClose} className="ok-button" value="OK" />
				</div>
			</DialogContent>
		</Dialog>
	)
}
