import { FormEvent, useRef } from "react";


export default function useInput(setNewUserMessage: (input: string) => void) {
    const inputRef = useRef<HTMLInputElement>(null)

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const input = inputRef.current!.value
        inputRef.current!.value = ''

        setNewUserMessage(input)
    }

    return { inputRef, onSubmit }
}