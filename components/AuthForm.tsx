"use client";

import { signIn, signUp } from "@/lib/actions/user.actions";
import { authFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomInput from "./CustomInput";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

const AuthForm = ({ type }: { type: "sign-up" | "sign-in" }) => {
    const t = useTranslations("Auth");
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const formSchema = authFormSchema();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError("");
        const userData = { email: data.email, password: data.password };
        try {
            if (type === "sign-up") {
                const response = await signUp(userData);
                if (!response.error) {
                    setUser(response);
                    return;
                }
                throw new Error(response.error);
            }

            if (type === "sign-in") {
                const response = await signIn(userData);
                if (!response.error) {
                    router.push("/");
                    return;
                }
                throw new Error(response.error);
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <section className="auth-form">
            <div className="flex flex-col gap-1 max-md:gap-3">
                <h1 className="text-4xl lg:text-36 font-semibold text-white">
                    {type === "sign-in" ? t("SignIn") : t("SignUp")}
                    <p className="text-lg font-normal text-slate-400">
                        {t("desc")}
                    </p>
                </h1>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <CustomInput
                            control={form.control}
                            name="email"
                            label={t("Email")}
                            placeholder={t("EnterEmail")}
                            type="email"
                        />
                        <CustomInput
                            control={form.control}
                            name="password"
                            label={t("Password")}
                            placeholder={t("EnterPassword")}
                            type="password"
                        />
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
                                ) : type === "sign-in" ? (
                                    t("SignIn")
                                ) : (
                                    t("SignUp")
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
                <footer className="flex justify-center gap-1">
                    <p className="text-14 font-normal text-slate-400">
                        {type === "sign-in" ? t("NoAccount") : t("HaveAccount")}
                    </p>
                    <Link
                        href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                        className="form-link"
                    >
                        {type === "sign-in" ? t("SignUp") : t("SignIn")}
                    </Link>
                </footer>
            </div>
        </section>
    );
};

export default AuthForm;
