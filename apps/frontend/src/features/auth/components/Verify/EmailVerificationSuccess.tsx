import { useEffect, useState } from "react"
import { setCredential } from "../../slice/authSlice"
import { useAppDispatch } from "../../../../app/hook/useAppStore"
import { LoginResponseWithoutState } from "../../type/types"
import { toast } from "sonner"

type EmailVerificationProps = {
    userData: LoginResponseWithoutState
}

const EmailVerificationSuccess = ({ userData }: EmailVerificationProps) => {
    const [time, setTimer] = useState<number>(5)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const timer = setInterval(() => {
            setTimer(prev => {
                return prev > 0 ? --prev : 0
            })
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (time === 0) {
            toast.success('Welcome')
            dispatch(setCredential(userData))
        }
    }, [time])

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl text-success">Email Successfully Verified</h1>
            <div className="text-center">
                <p>You’ll be redirected to home page in {time} seconds</p>
            </div>
        </div>
    )
}

export default EmailVerificationSuccess