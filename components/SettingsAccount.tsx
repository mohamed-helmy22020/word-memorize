"use client";

import { updateUserInfo } from "@/lib/actions/user.actions";
import { accountFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import CustomInput from "./CustomInput";
import LanguageSelect from "./LanguageSelect";
import { Button } from "./ui/button";
import { Form, FormLabel } from "./ui/form";

type Props = {
    user: User;
};

const SettingsAccount = ({ user: userProp }: Props) => {
    const [user, setUser] = useState<User>(userProp);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const formSchema = accountFormSchema();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name,
            language: { name: "", code: user.language },
        },
    });

    const setLanguage = (value: Lang) => {
        form.setValue("language", value);
    };

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError("");
        const userData = { name: data.name, language: data.language };
        try {
            const response = await updateUserInfo(user.id, userData);
            if (!response.error) {
                setUser(response);
                return;
            }
            throw new Error(response.error);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="px-5">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <CustomInput
                        control={form.control}
                        name="name"
                        label="Your name"
                        placeholder="Your name"
                        type="text"
                    />
                    <div>
                        <FormLabel className="form-label">
                            Your language
                        </FormLabel>
                        <LanguageSelect
                            lang={form.watch("language")}
                            setLang={setLanguage}
                            allLanguages={true}
                        />
                        <p className="ps-1 text-gray-500">
                            The language that words will be translated to
                        </p>
                    </div>
                    <div className="text-red-600 text-xl text-center">
                        {error}
                    </div>
                    <div className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            variant="secondary"
                            className=""
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2
                                        size={20}
                                        className="animate-spin"
                                    />
                                    &nbsp;Loading...
                                </>
                            ) : (
                                "Update"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default SettingsAccount;
