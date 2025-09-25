import { useCallback, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { VerifyAccountSchema } from "../../../../types"
import { useVerifyMutation } from "../../features/auth/slice/authApiSlice"
import EmailVerificationSuccess from "../../features/auth/components/Verify/EmailVerificationSuccess"
import EmailVerificationError from "../../features/auth/components/Verify/EmailVerificationError"
import Loading from "../../components/ui/Loading"

const EmailVerification = () => {
  const [searchParams] = useSearchParams()
  const [verify, { isLoading, isError, data }] = useVerifyMutation()
  const navigate = useNavigate()

  // Function verify the user
  const verifyUser = useCallback(
    async (token: string) => {
      const data: VerifyAccountSchema = {
        token,
        state: "newAccount"
      }

      await verify(data).unwrap()
    },
    [verify]
  )

  useEffect(() => {
    const token = searchParams.get("token")
    if (!token) {
      navigate("/", { replace: true })
      return
    }

    // Send Token to Server
    verifyUser(token)
  }, [verifyUser])

  let content
  if (isLoading) content = <Loading />
  if (isError) content = <EmailVerificationError />
  if (data) content = <EmailVerificationSuccess userData={data} />

  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      {content}
    </div>
  )
}

export default EmailVerification
