import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginResponse } from "../../../../../types";


export type AuthState = Omit<LoginResponse<'loggedIn'>, 'condition' | 'success'>


const initialState: AuthState = {
    userDetail: undefined,
    accessToken: undefined
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredential: (state, { payload }: PayloadAction<AuthState>) => {
            const { userDetail, accessToken } = payload

            state.userDetail = userDetail
            state.accessToken = accessToken
        },
        logout: state => {
            state.userDetail = null
            state.accessToken = null
        }
    }
})

export default authSlice.reducer
export const { setCredential, logout } = authSlice.actions