import { configureStore } from "@reduxjs/toolkit"
import stateReducer from "./slice"

export const store = configureStore({
	reducer: {
		home: stateReducer
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
