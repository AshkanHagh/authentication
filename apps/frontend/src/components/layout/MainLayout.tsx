import { ReactNode } from "react"
import { Toaster } from "sonner"
import Loading from "../ui/Loading"
import useGetUser from "../../features/auth/hooks/useGetUser"

type MainLayoutProps = {
    children: ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {

    const isLoading = useGetUser()

    if (isLoading) return <Loading />

    return (
        <>
            {children}
            <Toaster richColors position="bottom-center" />
        </>
    )
}

export default MainLayout