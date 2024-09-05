import type {
    EmailCheckResponse,
    LoginResponse,
    LoginSchema,
    RefreshTokenResponse,
    RegisterResponse,
    VerifyAccountSchema
} from "../../../../../types";
import apiSlice from "../../../app/api/apiSlice";
import { RegisterSchema } from "../../../../../types/index";

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        checkEmail: builder.query<EmailCheckResponse, string>({
            query: email => `/auth/email-check?email=${email}`
        }),
        register: builder.mutation<RegisterResponse, RegisterSchema>({
            query: formData => ({
                url: '/auth/register',
                method: 'POST',
                body: formData
            })
        }),
        login: builder.mutation<LoginResponse<'loggedIn'> | LoginResponse<'needVerify'>, LoginSchema>({
            query: (data) => ({
                url: '/auth/login',
                method: 'POST',
                body: data
            })
        }),
        verify: builder.mutation<LoginResponse<'loggedIn'>, VerifyAccountSchema>({
            query: data => ({
                url: '/auth/verify',
                method: 'POST',
                body: data
            })
        }),
        refresh: builder.query<RefreshTokenResponse, void>({
            query: () => '/auth/refresh'
        })
    })
})

export const {
    useLazyCheckEmailQuery,
    useRegisterMutation,
    useVerifyMutation,
    useLoginMutation,
    useLazyRefreshQuery
} = authApiSlice
