import type {
  BasicResponse,
  BasicUserIncludedResponse,
  LoginResponse,
  LoginSchema,
  VerifyAccountSchema
} from "../../../../../types"
import apiSlice from "../../../app/api/apiSlice"
import { RegisterSchema } from "../../../../../types/index"
import { LoginResponseWithoutState } from "../type/types"

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkEmail: builder.query<BasicResponse, string>({
      query: (email) => `/auth/email-check?email=${email}`,
      keepUnusedDataFor: 10
    }),
    register: builder.mutation<BasicResponse, RegisterSchema>({
      query: (formData) => ({
        url: "/auth/register",
        method: "POST",
        body: formData
      })
    }),
    login: builder.mutation<
      LoginResponse<"loggedIn"> | LoginResponse<"needVerify">,
      LoginSchema
    >({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data
      })
    }),
    verify: builder.mutation<LoginResponseWithoutState, VerifyAccountSchema>({
      query: (data) => ({
        url: "/auth/verify",
        method: "POST",
        body: data
      })
    }),
    getUser: builder.query<BasicUserIncludedResponse, void>({
      query: () => "/auth/me"
    })
  })
})

export default authApiSlice

export const {
  useLazyCheckEmailQuery,
  useRegisterMutation,
  useVerifyMutation,
  useLoginMutation
} = authApiSlice
