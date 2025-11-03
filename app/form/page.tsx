'use client';

import { DevModeToggle } from "@/components/custom/dev-toggle-theme";
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosResponse } from "axios"
// import { useRouter } from "next/navigation"
import React from "react";
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from 'zod';


// Login Schema
const formSchema = z.object({
    name: z.string()
        .min(1, "Name must be at least 8 characters."),
    email: z.email(),
    phone: z.string()
        .refine((value) => value.length === 10,
            "Phone number must be of 10 characters."),
    remark: z.string()
        .min(1, "Remark must be at least 1 characters.")
        .max(100, "Remark must be at most 100 characters."),

});

export default function Form() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            remark: ""
        },
    });

    // Prefill Email
    const setValueRef = React.useRef(form.setValue);

    // Navigation Handler
    // const router = useRouter();

    React.useEffect(() => {
        const getTokenDetails = async () => {
            try {
                const response: AxiosResponse = await axios.get("/api/helper");

                const data = response.data;
                if (response.status === 200) {
                    setValueRef.current("email", data.email);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const { status, data } = error.response;

                    if (status === 500) {
                        toast.error(data.error || "Internal Server Error");
                    }
                } else {
                    toast.error("Some unknown error occured");
                }
            }
        }

        getTokenDetails();
    }, []);

    // Handle Submit
    async function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values);
        toast.success("Form Submitted!");
        form.reset();

        // try {
        //     const response: AxiosResponse = await axios.post("/api/auth", values, {
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //     });

        //     const data = response.data;
        //     if (response.status === 200) {
        //         toast.success("Login Successful!");
        //         console.log(data);
        //         setTimeout(() => {
        //             router.push("/questions");
        //         }, 500);
        //     }
        // } catch (error) {
        //     if (axios.isAxiosError(error) && error.response) {
        //         const { status, data } = error.response;

        //         if (status === 500) {
        //             toast.error(data.error || "Internal Server Error");
        //         }
        //     } else {
        //         toast.error("Some unknown error occured");
        //     }
        // } finally {
        //     form.reset();
        // }
    }

    return (
        <main className="h-screen w-screen py-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md max-md:w-4/5">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <FieldSet>
                            <div className=" w-full h-fit flex items-center justify-between">
                                <h1 className="w-fit text-2xl max-md:text-xl">
                                    Questionnaire Form
                                </h1>
                                <div className="w-fit">
                                    <DevModeToggle />
                                </div>
                            </div>
                            <FieldGroup className="gap-4 max-md:gap-3">
                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="max-md:gap-1.5" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="name">
                                                Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="name"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="John Doe"
                                                className="max-md:text-xs"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="email"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="max-md:gap-1.5" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="email">Email</FieldLabel>
                                            <Input
                                                {...field}
                                                type="email"
                                                id="email"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="someone@example.com"
                                                className="max-md:text-xs"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="phone"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="max-md:gap-1.5" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="phone">Phone</FieldLabel>
                                            <Input
                                                {...field}
                                                type="number"
                                                id="phone"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="+91-999-999-9999"
                                                className="max-md:text-xs"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <div className="grid grid-cols-1">
                                    <Field className="max-md:gap-1.5">
                                        <FieldLabel htmlFor="select-time">
                                            Select Time
                                        </FieldLabel>
                                        <Select defaultValue="">
                                            <SelectTrigger id="select-time">
                                                <SelectValue placeholder="24h or 48h" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="24">24h</SelectItem>
                                                <SelectItem value="48">48h</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </div>
                                <Controller
                                    name="remark"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="max-md:gap-1.5" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="remark">
                                                Remark
                                            </FieldLabel>
                                            <InputGroup>
                                                <InputGroupTextarea
                                                    {...field}
                                                    id="remark"
                                                    placeholder="I'm having an issue with the login button on mobile."
                                                    rows={6}
                                                    className="min-h-24 resize-none max-md:text-xs"
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                <InputGroupAddon align="block-end">
                                                    <InputGroupText className="tabular-nums max-md:text-xs">
                                                        {field.value.length}/100 characters
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <FieldDescription className="max-md:text-xs">
                                                Include all the things in your mind so we can generate
                                                helpful insights for your business
                                            </FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </FieldSet>
                        <Field orientation="horizontal" className="w-full grid grid-cols-2 items-center justify-center">
                            <Button onClick={() => form.reset()} className="max-md:text-xs" variant="outline" type="button">
                                Cancel
                            </Button>
                            <Button className="max-md:text-xs" type="submit">Submit</Button>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </main>
    )
}
