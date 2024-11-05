"use client";
import { Button } from "@/components/ui/button";
import notFoundAnimation from "@/public/animated icons/not_found.json";
import { useTakeTestsStore } from "@/store/takeTestsStore";
import Lottie from "lottie-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingComponent from "./LoadingComponent";

type Props = {
    testId: string;
};

const TestResultData = ({ testId }: Props) => {
    const [tests, currentTest] = useTakeTestsStore((state) => [
        state.tests,
        state.tests?.find((t) => t.id === testId),
    ]);

    if (tests?.length !== undefined && !currentTest) {
        return <TestNotFound />;
    }

    if (tests === undefined || currentTest === undefined) {
        return <LoadingComponent />;
    }

    return <div>TestResultData</div>;
};

const TestNotFound = () => {
    const router = useRouter();
    return (
        <div className="flex flex-col justify-center items-center flex-1 text py-5">
            <h2 className="font-bold text-3xl">
                Test with this id cannot be found.
            </h2>
            <Lottie
                animationData={notFoundAnimation}
                loop={false}
                style={{
                    flex: "1 1 0%",
                    height: "300px",
                    width: "300px",
                }}
            />
            <Button
                asChild
                className="px-10 py-5 text-1xl mb-5"
                variant="destructive"
            >
                <Link href="/test_results">Results Page</Link>
            </Button>
        </div>
    );
};
export default TestResultData;
