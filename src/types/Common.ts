import type { ChangeEvent } from "react"
import type { ReduxState } from "./ReduxState"

export interface ReduxStore {
	home: ReduxState
}

export type InputChanged = (e: ChangeEvent<HTMLInputElement>) => void
export type NumberChanged = (num: number) => void
export type StringChanged = (str: string) => void
export type EmptyVoid = () => void
