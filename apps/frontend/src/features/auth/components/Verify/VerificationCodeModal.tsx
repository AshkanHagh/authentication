import { toast } from "sonner"
import { VerifyAccountSchema } from "../../../../../../types"
import useVerificationCode from "../../hooks/useVerificationCode"
import { useVerifyMutation } from "../../slice/authApiSlice"
import VerificationCodeInput from "./VerificationCodeInput"
import { setCredential } from "../../slice/authSlice"
import { useAppDispatch } from "../../../../app/hook/useAppStore"

type VerificationCodeModalProps = {
  token: string
  setActivationToken: React.Dispatch<
    React.SetStateAction<string | undefined | null>
  >
}

const VerificationCodeModal: React.FC<VerificationCodeModalProps> = ({
  token,
  setActivationToken
}) => {
  const [verify, { isLoading }] = useVerifyMutation()
  const dispatch = useAppDispatch()
  const { values, inputRefs, handleChange, handleKeyDown, onInputsComplete } =
    useVerificationCode(6)

  onInputsComplete(async (verifyCode) => {
    const data: VerifyAccountSchema = {
      token: token,

      state: "existingAccount",
      code: verifyCode
    }

    const response = await verify(data).unwrap()

    if (!response.success) return

    // Response Success
    dispatch(setCredential(response))
    toast.success("Login successfully")
    setActivationToken(undefined)
  })

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 px-2">
        <div className="bg-base-100 rounded-xl py-5 px-2 shadow-2xl shadow-stone-950 xs:px-5">
          <h1 className="xs:tracking-wider text-center font-light">
            The verification code has been sent to your email
          </h1>
          <div className="grid grid-cols-6 justify-items-center p-2 py-5">
            {values.map((val, index) => (
              <VerificationCodeInput
                disabled={isLoading}
                onChange={(e) => handleChange(e, index)}
                value={val}
                key={index}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => {
                  if (el) {
                    inputRefs.current![index] = el
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default VerificationCodeModal
