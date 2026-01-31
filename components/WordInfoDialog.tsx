import { useLanguagesStore } from "@/store/userLanguagesStore";
import { Volume2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

type Props = {
    open?: boolean;
    setOpen?: (open: boolean) => void;
    word: WordType;
};

const WordInfoDialog = ({ open, setOpen, word }: Props) => {
    const { currentLanguage } = useLanguagesStore();

    const handleListen = () => {
        speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(word.secondLang);

        speech.lang = currentLanguage.code;
        speech.rate = 1;
        speechSynthesis.speak(speech);
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[90svh] overflow-hidden overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Word Info</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <p>Word:</p>
                        <p dir="auto" className="border-2 p-2">
                            {word?.secondLang}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p>Translation:</p>
                        <p dir="auto" className="border-2 p-2">
                            {word?.firstLang}
                        </p>
                    </div>
                    {word?.desc && (
                        <div className="flex flex-col gap-2">
                            <p>Description:</p>
                            <p dir="auto" className="border-2 p-2">
                                {word.desc}
                            </p>
                        </div>
                    )}
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
            </DialogContent>
        </Dialog>
    );
};

export default WordInfoDialog;
