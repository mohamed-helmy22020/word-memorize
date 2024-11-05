"use client";
import { Button } from "@/components/ui/button";
import { ArrowBigUp } from "lucide-react";
import { useEffect, useRef } from "react";
type Props = {};

const ToTopButton = ({}: Props) => {
    const toTopButtonElement = useRef<HTMLButtonElement>(null);
    const goToTopFunction = () => {
        window.scroll({
            left: 0,
            top: 0,
            behavior: "smooth",
        });
    };
    useEffect(() => {
        const showToTopButton = () => {
            if (window.scrollY > 200) {
                toTopButtonElement.current?.classList.add("show");
            } else {
                toTopButtonElement.current?.classList.remove("show");
            }
        };
        window.addEventListener("scroll", showToTopButton);

        return () => {
            window.removeEventListener("scroll", showToTopButton);
        };
    }, []);

    return (
        <Button
            onClick={goToTopFunction}
            variant="secondary"
            className="to-top-button"
            ref={toTopButtonElement}
        >
            <ArrowBigUp />
        </Button>
    );
};

export default ToTopButton;
