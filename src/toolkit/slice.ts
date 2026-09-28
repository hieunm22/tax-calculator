import { ReduxState } from "types/ReduxState"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LS_DARKMODE } from "common/constants"

const initialState: ReduxState = {
	activePopup: 0,
	darkMode: localStorage.getItem(LS_DARKMODE) === "dark",
	lang: "en"
}

const homeSlice = createSlice({
	name: "home",
	initialState,
	reducers: {
		setDarkMode: (state, body: PayloadAction<boolean>) => {
			state.darkMode = body.payload
		},
		showPopup(state: ReduxState, body: PayloadAction<number>) {
			state.activePopup = body.payload
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
