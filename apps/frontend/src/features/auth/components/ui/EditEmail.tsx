import { useSearchParams } from "react-router-dom"
import { MdEdit } from "react-icons/md";

type EditEmailProps = {
    email: string
}


const EditEmail = ({ email }: EditEmailProps) => {
    const [_, setSearchParams] = useSearchParams()

    const handleEditEmail = () => {
        setSearchParams(params => {
            params.delete('status')
            params.delete('name')
            return params
        })
    }
    return (
        <button onClick={handleEditEmail} className="hover:underline">
            <div className="flex items-center gap-1 ml-1 opacity-80">
                <p>
                    EMAIL:&#160;
                    <span className="opacity-70">
                        {email ? email : 'Click to enter your email'}
                    </span>
                </p>
                <MdEdit />
            </div>
        </button>
    )
}

export default EditEmail