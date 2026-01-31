"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateUserInfo } from "@/lib/actions/user.actions";
import { useState } from "react";
type Props = {
    user: User;
};

const SettingsTranslation = ({ user }: Props) => {
    const [error, setError] = useState("");
    const onValueChange = async (value: string) => {
        try {
            const updateDataRes = await updateUserInfo(user.id, {
                translationType: value as TranslationTypes,
            });
            if (updateDataRes.error) throw new Error(updateDataRes.error);
        } catch (error) {
            console.log(error);
            setError("Something went wrong");
        }
    };
    return (
        <div className="p-3">
            <h2 className="text-lg font-semibold mb-3">Translation type</h2>
            <Select onValueChange={onValueChange}>
                <SelectTrigger className="w-full uppercase">
                    <SelectValue placeholder={user.translationType} />
                </SelectTrigger>
                <SelectContent className="uppercase">
                    <SelectItem value="ai">ai</SelectItem>
                    <SelectItem value="provider">provider</SelectItem>
                </SelectContent>
            </Select>
            <div className="text-red-600 text-xl pt-4">{error}</div>
        </div>
    );
};

export default SettingsTranslation;
