import { Link } from "react-router-dom"
import Button from "../../../../components/ui/Button"
import PasswordInput from "../ui/PasswordInput"

export const Login = () => {
    return (
        <form className="flex flex-col gap-5">
            <h1 className="-mb-2 text-2xl font-bold text-center">
                I'm glad you're back, shahin
            </h1>
            <div className="flex flex-col -space-y-3">
                <div className="flex items-center gap-1 mb-2 ml-1 opacity-80">
                    <p>
                        EMAIL:&#160;
                        <span className="opacity-70">
                            shahin@gmail.com
                        </span>
                    </p>
                    <Link to='#'>
                        <Button variant="btn-link" className="px-0">
                            Edit
                        </Button>
                    </Link>
                </div>
                <PasswordInput />
            </div>
            <Button className="tracking-widest uppercase" type="button">
                Login
            </Button>
        </form>
    )
}