import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
interface sideBarsStateType {
    show: boolean;
    setShow: (show: boolean) => void;
}
export const useSideBarStore = create<sideBarsStateType>()(
    devtools(
        persist(
            (set) => ({
                show: false,
                setShow: (show: boolean) =>
                    set(
                        produce((state: sideBarsStateType) => {
                            state.show = show;
                        })
                    ),
            }),
            { name: "sideBarStore" }
        ),
        { name: "sideBarStore" }
    )
);
