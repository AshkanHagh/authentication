import { ReactNode, useEffect, useState } from "react"
import { Toaster } from "sonner"
import { useLazyRefreshQuery } from "../../features/auth/slice/authApiSlice"
import { useAppDispatch } from "../../app/hook/useAppStore"
import { logout, setCredential } from "../../features/auth/slice/authSlice"
import Loading from "../ui/Loading"

type MainLayoutProps = {
    children: ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const dispatch = useAppDispatch()

    const [refresh, { isLoading = true }] = useLazyRefreshQuery()
    const [isChecked, setIsChecked] = useState<boolean>(false)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await refresh().unwrap()
                // Success
                dispatch(setCredential(response))
            } catch (err) {
                console.log(err)
                dispatch(logout())
            } finally {
                setIsChecked(true)
            }
        }
        fetchUserData()
    }, [])

    if (isLoading || !isChecked) {
        return <Loading />
    }

    return (
        <>
            {children}
            <Toaster richColors position="bottom-center" />
        </>
    )
}

export default MainLayout