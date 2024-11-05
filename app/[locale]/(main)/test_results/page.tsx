import TestResultDataComponent from "@/components/TestResultData";
import TestResultsComponent from "@/components/TestResults";

const TestResultsPage = ({
    searchParams: { testId },
}: {
    searchParams: {
        testId?: string;
    };
}) => {
    if (testId) {
        return <TestResultDataComponent testId={testId} />;
    }
    return <TestResultsComponent />;
};

export default TestResultsPage;
