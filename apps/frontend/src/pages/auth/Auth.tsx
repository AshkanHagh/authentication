import { useSearchParams } from "react-router-dom"
import { Login } from "../../features/auth/index"
import { Register } from "../../features/auth/index"
import { EmailEntry } from "../../features/auth/index"

const Auth = () => {
    const [searchParams] = useSearchParams()
    const authStatus: string | null = searchParams.get('status')
    
    const getContent = (status: string | null) => {
        switch (status) {
            case 'login':
                return <Login />
            case 'register':
                return <Register />
            default:
                return <EmailEntry />
        }
    }

    return (
        <div className="flex flex-col justify-center max-w-md p-2 mx-auto h-dvh">
            {getContent(authStatus)}
        </div>
    )
}

export default Auth
