import { useCallback, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { VerifyAccountSchema } from "../../../../types"
import { useVerifyMutation } from "../../features/auth/slice/authApiSlice"
import EmailVerificationSuccess from "../../features/auth/components/Verify/EmailVerificationSuccess"
import EmailVerificationError from "../../features/auth/components/Verify/EmailVerificationError"
import { useAppDispatch } from "../../app/hook/useAppStore"
import { setCredential } from "../../features/auth/slice/authSlice"
import Loading from "../../components/ui/Loading"

const EmailVerification = () => {
  const [searchParams] = useSearchParams()
  const [verify, { isLoading, isError }] = useVerifyMutation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()


  // Function verify the user
  const verifyUser = useCallback(async (token: string) => {
    console.log('render')
    const data: VerifyAccountSchema = {
      token,
      condition: 'newAccount'
    }
    try {
      const response = await verify(data).unwrap()
      dispatch(setCredential({ ...response }))

    } catch (error) {
      console.log(error)
    }
  }, [verify])


  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      navigate('/', { replace: true })
      return
    }

    // Send Token to Server
    verifyUser(token)
  }, [verifyUser])

  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      {/* Loading */}
      {isLoading && (
        <Loading />
      )}
      {!isLoading && isError &&
        // error
        <EmailVerificationError />
      }
      {!isLoading && !isError &&
        // success
        <EmailVerificationSuccess />}
    </div>
  )
}

export default EmailVerification