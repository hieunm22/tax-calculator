/* eslint-disable max-lines, max-len */
import { ReduxState } from "@/types/ReduxState"
import { createSlice } from "@reduxjs/toolkit"

const initialState: ReduxState = {
	activePopup: 0,
	darkMode: false,
	lang: "en"
}

const homeSlice = createSlice({
	name: "home",
	initialState,
	reducers: {
		setDarkMode(state: ReduxState, action: { type: string; payload: boolean }) {
			state.darkMode = action.payload
		},
		showPopup(state: ReduxState, action: { type: string; payload: number }) {
			state.activePopup = action.payload
		}
	}
})

export const {
	// define your actions here
	setDarkMode,
	showPopup
} = homeSlice.actions

const { reducer } = homeSlice
export default reducer
