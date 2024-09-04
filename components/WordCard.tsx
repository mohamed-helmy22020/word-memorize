"use client";
import { Volume2 } from "lucide-react";
import { useRef } from "react";

const WordCard = ({ firstLang, secondLang, sound }: WordCardProps) => {
    return (
        <div className="word-card">
            <div className="first-lang">{firstLang}</div>
            <div className="second-lang">{secondLang}</div>
            {sound?.length && (
                <>
                    {sound.map((s) => (
                        <WordSound
                            key={s.type}
                            type={s.type}
                            soundLink={s.media}
                            phonetic={s.phonetic}
                        />
                    ))}
                </>
            )}
        </div>
    );
};
const WordSound = ({ type, soundLink, phonetic }: WordSoundProps) => {
    const audio = useRef<HTMLAudioElement>(null);
    return (
        <div className="flex mt-3 justify-center items-center">
            <div
                className="cursor-pointer"
                onClick={() => audio.current?.play()}
            >
                <audio
                    src={soundLink}
                    controls
                    className="hidden"
                    ref={audio}
                ></audio>
                <Volume2 />
            </div>
            <span className="inline-block ml-2 font-semibold text-lg">
                {type}
            </span>
            <span className="inline-block ml-2  text-lg">{phonetic}</span>
        </div>
    );
};

export default WordCard;
