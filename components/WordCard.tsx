"use client";
import { useLanguagesStore } from "@/store/userLanguages";
import { Volume2 } from "lucide-react";

const WordCard = ({ firstLang, secondLang }: WordCardProps) => {
    const { currentLanguage } = useLanguagesStore();
    const handleListen = () => {
        const speech = new SpeechSynthesisUtterance(secondLang);
        speech.lang = currentLanguage.code;

        console.log(window.speechSynthesis.getVoices());
        speechSynthesis.speak(speech);
    };
    return (
        <div className="word-card">
            <div className="first-lang">{firstLang}</div>
            <div className="second-lang">{secondLang}</div>
            <div onClick={handleListen}>listen</div>
            <div
                className="flex mt-3 justify-center items-center cursor-pointer"
                onClick={handleListen}
            >
                <div className="">
                    <Volume2 />
                </div>
                <span className="inline-block ml-2 font-semibold text-lg">
                    Listen
                </span>
            </div>
        </div>
    );
};

export default WordCard;
