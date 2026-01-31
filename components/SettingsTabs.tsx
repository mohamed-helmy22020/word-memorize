import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import SettingsAccount from "./SettingsAccount";
import SettingsAI from "./SettingsAI";
import SettingsTranslation from "./SettingsTranslation";
import SettingsUI from "./SettingsUI";

const SettingsTabs = async () => {
    const user: User = await getLoggedInUser();
    console.log({ user });
    return (
        <div>
            <Tabs defaultValue="account" className="w-full ms-0 m-1">
                <TabsList className="w-full bg-[#242526] flex">
                    <TabsTrigger value="account" className="flex-1">
                        Account
                    </TabsTrigger>
                    <TabsTrigger value="ui" className="flex-1">
                        UI
                    </TabsTrigger>
                    <TabsTrigger value="translation" className="flex-1">
                        Translation
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="flex-1">
                        AI
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <SettingsAccount user={user} />
                </TabsContent>
                <TabsContent value="ui">
                    <SettingsUI />
                </TabsContent>
                <TabsContent value="translation">
                    <SettingsTranslation user={user} />
                </TabsContent>
                <TabsContent value="ai">
                    <SettingsAI user={user} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SettingsTabs;
