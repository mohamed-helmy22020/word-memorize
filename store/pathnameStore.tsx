import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface pathNameStateType {
    pathName: string;

    setPathName: (pathName: string) => void;
}
export const usePathNameStore = create<pathNameStateType>()(
    devtools(
        (set) => ({
            pathName: "",

            setPathName: (pathName: string) =>
                set(
                    produce((state: pathNameStateType) => {
                        state.pathName = pathName;
                    })
                ),
        }),
        { name: "Pathname Store" }
    )
);
