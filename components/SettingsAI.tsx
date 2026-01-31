"use client";
import { updateUserInfo } from "@/lib/actions/user.actions";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
    user: User;
};

const SettingsAI = ({ user }: Props) => {
    const [apiKey, setApiKey] = useState(user.ai_key ? "****************" : "");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const updateValue = async (value: string) => {
        setIsLoading(true);
        setError("");
        try {
            const updateDataRes = await updateUserInfo(user.id, {
                apiKey: value,
            });
            if (updateDataRes.error) throw new Error(updateDataRes.error);
        } catch (error) {
            console.log(error);
            setError("Something went wrong");
        }
        setIsLoading(false);
    };
    return (
        <div className="p-3">
            <h2 className="text-lg font-semibold mb-3">AI API Key</h2>
            <Input
                placeholder="Enter AI API key"
                className="focus-visible:ring-transparent"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="ps-1 text-yellow-700">
                Warning: The key will be encrypted and you can{"'"}t see it
                anymore
            </p>
            <div className="text-red-600 text-xl pt-4">{error}</div>
            <Button
                onClick={() => updateValue(apiKey)}
                variant="secondary"
                className=""
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        &nbsp;Loading...
                    </>
                ) : (
                    "Update"
                )}
            </Button>
        </div>
    );
};

export default SettingsAI;
