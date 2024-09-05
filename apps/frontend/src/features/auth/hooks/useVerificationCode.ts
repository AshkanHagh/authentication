import { useRef, useState } from "react"

// Types for the event handlers
type HandleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void
type HandleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => void
type OnInputsComplete = (callback: (verifyCode: string) => void) => void

// Return type for the custom hook
type VerificationCodeReturnType = {
    values: string[]
    inputRefs: React.RefObject<HTMLInputElement[]>
    handleChange: HandleChange
    handleKeyDown: HandleKeyDown,
    onInputsComplete: OnInputsComplete
}

const useVerificationCode = (length: number): VerificationCodeReturnType => {
    // State to store input values, initialized with empty strings
    const [values, setValues] = useState<string[]>(Array(length).fill(''))
    // Ref to keep track of input elements
    const inputRefs = useRef<HTMLInputElement[]>([])

    // Function to handle input changes
    const handleChange: HandleChange = (e, index) => {
        const value = e.target.value
        if (value.length > 1 || (index === length - 1 && values[index])) return; // Prevent entering more than one character or changing the last input if already filled

        setValues(prev => {
            const newValues = [...prev]
            newValues[index] = value.toUpperCase()

            // Check if all inputs are filled after the current input change
            if (newValues.every((val) => val !== "")) {
                const verifyCode = newValues.join("");
                onInputsCompleteCallback(verifyCode);
            }

            return newValues
        })

        // Automatically move to the next input if the current one is filled
        if (value && index < length - 1) {
            inputRefs.current[index + 1].focus()
        }

    }

    // Function to handle key down events, primarily for handling backspace
    const handleKeyDown: HandleKeyDown = (e, index) => {
        const key = e.key
        if (key === 'Backspace') {
            if (!values[index] && index > 0) {
                // Move to the previous input and clear it if the current one is empty
                setValues(prev => {
                    const newValues = [...prev]
                    newValues[index - 1] = ''
                    return newValues
                })
                inputRefs.current[index - 1].focus()
            } else {
                // Clear the current input
                setValues(prev => {
                    const newValues = [...prev]
                    newValues[index] = ''
                    return newValues
                })
            }
        }
    }

    let onInputsCompleteCallback: (verifyToken: string) => void
    
    const onInputsComplete: OnInputsComplete = (callback) => {
        onInputsCompleteCallback = callback
    }

    return {
        values,
        inputRefs,
        handleChange,
        handleKeyDown,
        onInputsComplete
    }
}

export default useVerificationCode
