import { authFormSchema } from "@/lib/utils";
import { FormControl, FormField, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

const formSchema = authFormSchema();

type CustomInputType = {
    control: any;
    name: any;
    label: string;
    placeholder: string;
    type?: string;
};

const CustomInput = ({
    control,
    name,
    label,
    placeholder,
    type,
}: CustomInputType) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <div className="form-item">
                    <FormLabel className="form-label">{label}</FormLabel>
                    <div className="flex w-full flex-col">
                        <FormControl>
                            <Input
                                placeholder={placeholder}
                                className="focus-visible:ring-transparent"
                                {...field}
                                type={type}
                            ></Input>
                        </FormControl>
                        <FormMessage className="form-message mt-2" />
                    </div>
                </div>
            )}
        />
    );
};

export default CustomInput;
