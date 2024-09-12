import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { RefreshTokenResponse } from "../../../../types";
import { logout, setCredential } from "../../features/auth/slice/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: 'api',
    prepareHeaders: (headers, { getState }) => {
        const token: string | undefined | null = (getState() as RootState).auth.accessToken
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    },
    credentials: 'include'
})

const baseQueryWithReauth = async (args: FetchArgs | string, api: BaseQueryApi, extraOptions: { retryCount?: number }) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result.error?.status === 401 && (extraOptions?.retryCount ?? 0) < 2) {
        try {
            const refreshResponse = await baseQuery('auth/refresh', api, extraOptions)

            if (refreshResponse.data) {
                const userDetail = (api.getState() as RootState).auth
                const { accessToken } = (refreshResponse.data as RefreshTokenResponse)
                api.dispatch(setCredential({ ...userDetail, accessToken }))

                result = await baseQuery(args, api, { retryCount: (extraOptions?.retryCount ?? 0) + 1 })
            }

        } catch (err) {
            api.dispatch(logout())
        }
    }
    return result
}

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({})
})

export default apiSlice