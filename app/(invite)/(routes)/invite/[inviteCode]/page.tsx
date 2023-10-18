import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps{
    params: {
        inviteCode: string;
    };
}

const InviteCodePage = async({
    params
}: InviteCodePageProps) => {
    const profile = await currentProfile();

    if(!profile){
        redirectToSignIn();
    }

    if(!params.inviteCode) {
        redirect("/");
    }

    const existingServer = await db.server.findFirst({
        where:{
            inviteCode: params.inviteCode,
            members: {
                some: {
                    //@ts-ignore
                    profileId: profile.id,
                }
            }
        }
    });

    if(existingServer){
        return redirect(`/servers/${existingServer.id}`);
    }

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data:{
            members: {
                create: [
                    {
                        //@ts-ignore
                        profileId: profile.id,
                    }
                ]
            }
        } 
    });

    if (server){
        return redirect(`/servers/${server.id}`);
    }
    return null;
}
 
export default InviteCodePage;