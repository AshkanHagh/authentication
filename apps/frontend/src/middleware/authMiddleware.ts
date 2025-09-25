import { Middleware, MiddlewareAPI, PayloadAction } from "@reduxjs/toolkit"
import { AppDispatch, RootState } from "../app/store"
import authApiSlice from "../features/auth/slice/authApiSlice"
import { logout, setCredential } from "../features/auth/slice/authSlice"

const authMiddleware: Middleware =
  (store: MiddlewareAPI<AppDispatch, RootState>) =>
  (next) =>
  async (action) => {
    if ((action as PayloadAction).type === "auth/getUser") {
      try {
        const getUser = store.dispatch(
          authApiSlice.endpoints.getUser.initiate()
        )
        const user = await getUser.unwrap()

        const prevUserDetail = store.getState().auth
        store.dispatch(setCredential({ ...prevUserDetail, ...user }))
      } catch (_) {
        store.dispatch(logout())
      }
    }
    return next(action)
  }

export default authMiddleware
