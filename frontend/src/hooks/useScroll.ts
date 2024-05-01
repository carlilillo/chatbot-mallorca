import { useEffect, useRef, useState } from "react";

export default function useScroll(userMessages: message[]) {
    const [hide, setHide] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const offsetHeight = scrollRef.current?.offsetHeight!
        const scrollHeight = scrollRef.current?.scrollHeight!

        setHide(offsetHeight === scrollHeight)
    }, [userMessages])

    const handleScrollClick = () => {
        scrollRef.current?.scrollBy({
          top: scrollRef.current?.scrollHeight,
          left: 0,
          behavior: "smooth"
        })
        setHide(true)
    }

    scrollRef.current?.addEventListener("scrollend", () => {
        const offsetHeight = scrollRef.current?.offsetHeight!
        const scrollTop = scrollRef.current?.scrollTop!
        const scrollHeight = scrollRef.current?.scrollHeight!
        setHide(scrollHeight<= offsetHeight + scrollTop )
    })

    return { hide, scrollRef, handleScrollClick }
}