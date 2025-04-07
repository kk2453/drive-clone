"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {createAccount} from "@/lib/actions/user.actions";

const formSchema = z.object({
    username: z.string().min(2).max(50),
});

type FormType = 'sign-in' | 'sign-up';

const authFormSchema = (formType: FormType) => {
    return z.object({
        email: z.string().email(),
        fullName:
            formType === "sign-up"
                ? z.string().min(2).max(50)
                : z.string().optional(),
    });
};

const AuthForm = ({ type }: {type: FormType} ) => {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErorMessage] = useState("");
    const [accountId, setAccountId] = useState(null);

    const formSchema = authFormSchema(type);

    // 1. Form definition
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
        },
    });

    // 2. Submit handler
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setErorMessage("");

        try{
            const user = await createAccount({
                fullName: values.fullName || "",
                email: values.email,
            });

            setAccountId(user.accountId);
        } catch{
            setErorMessage("Failed to create account, please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-h-[800px] w-full max-w-[580px] flex-col justify-center space-y-6 transition lg:h-full lg:space-y-8">
                    <h1 className="text-center font-bold text-[#333F4E] md:text-left">
                        {type === "sign-in" ? "Sign In" : "Sign Up"}
                    </h1>
                    {type === 'sign-up' &&
                        <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex h-[72px] flex-col justify-center rounded-xl border border-[#F2F5F9] px-4 shadow-drop-1">
                                    <FormLabel className="text-[#333F4E] pt-2 body-2 w-full">Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your full name" className="border-none shadow-none p-0 placeholder:text-[#A3B2C7] text-[14px] leading-[20px] font-medium" {...field}/>
                                    </FormControl>
                                </div>
                                <FormMessage className="text-[#FF7474] body-2 ml-4"/>
                            </FormItem>
                        )}
                    />}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex h-[72px] flex-col justify-center rounded-xl border border-[#F2F5F9] px-4 shadow-drop-1">
                                    <FormLabel className="text-[#333F4E] pt-2 body-2 w-full">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" className="border-none shadow-none p-0 placeholder:text-[#A3B2C7] body-2" {...field}/>
                                    </FormControl>
                                </div>
                                <FormMessage className="text-[#FF7474] body-2 ml-4"/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="text-white bg-[#FA7275] hover:bg-[#EA6365] transition-all rounded-full text-[14px] leading-[20px] font-medium h-[66px]" disabled={isLoading}>
                        {type === "sign-in" ? "Sign In" : "Sign Up"}

                        {isLoading && (
                            <Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="ml-2 animate-spin"/>
                        )}
                    </Button>

                    {errorMessage && (
                        <p className="text-[14px] leading-[20px] font-medium mx-auto w-fit rounded-xl bg-[#b80000]/5 px-8 py-4 text-center text-[#b80000]">*{errorMessage}</p>
                    )}

                    <div className="flex justify-center text-[14px] leading-[20px] font-medium">
                        <p className="text-[#333F4E]">
                            {type === "sign-in" ? "Don't have an account?" : "Already have an account?"}
                        </p>
                        <Link href={type === "sign-in" ? "/sign-up" : "/sign-in"} className="ml-1 font-medium text-[#FA7275]">
                            {type === "sign-in" ? "Sign Up" : "Sign In "}
                        </Link>
                    </div>
                </form>
            </Form>
            {/*otp verification*/}
        </>
    )
};

export default AuthForm;