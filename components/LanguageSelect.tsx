"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn, languagesArray } from "@/lib/utils";
import { useLanguagesStore } from "@/store/userLanguagesStore";

interface LanguageSelectProps {
    lang: Lang;
    setLang: (lang: Lang) => void;
    allLanguages?: boolean;
}
const LanguageSelect = ({
    lang,
    setLang,
    allLanguages,
}: LanguageSelectProps) => {
    const [open, setOpen] = React.useState(false);
    const { languages } = useLanguagesStore();
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {lang.code
                        ? languagesArray.find(
                              (language) => language.code === lang.code,
                          )?.name
                        : "Select language..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                            {languagesArray
                                .filter(
                                    (l) =>
                                        allLanguages ||
                                        languages.findIndex(
                                            (l2) => l2.code === l.code,
                                        ) === -1,
                                )
                                .map((language) => (
                                    <CommandItem
                                        key={language.code}
                                        value={language.name}
                                        onSelect={(currentValue) => {
                                            setLang({
                                                name: currentValue,
                                                code: language.code,
                                            });
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                lang.code === language.code
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                            )}
                                        />
                                        {language.name}
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
export default LanguageSelect;
