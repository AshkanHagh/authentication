import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { setCredential } from "../../slice/authSlice"
import { useAppDispatch } from "../../../../app/hook/useAppStore"
import { LoginResponseWithoutCondition } from "../../type/types"

type EmailVerificationProps = {
    userData: LoginResponseWithoutCondition
}

const EmailVerificationSuccess = ({ userData }: EmailVerificationProps) => {
    const [time, setTimer] = useState<number>(5)
    const dispatch = useAppDispatch()
    const from: string = sessionStorage.getItem('from') || '/'

    useEffect(() => {
        const timer = setInterval(() => {
            setTimer(prev => {
                return prev > 0 ? --prev : 0
            })
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    if (time === 0) {
        dispatch(setCredential(userData))
        return <Navigate to={from} replace={true} />
    }

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