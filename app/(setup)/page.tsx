import { IntialModal } from "@/components/modals/intial-modal";
import { db } from "@/lib/db";
import { intialProfile } from "@/lib/intial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {

    const profile = await intialProfile();

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if(server){
        return redirect(`/servers/${server.id}`);
    }

    return (
        <IntialModal />
      );
}
 
export default SetupPage;