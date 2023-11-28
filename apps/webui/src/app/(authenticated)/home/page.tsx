import { redirect } from "next/navigation";

import { getServerSession } from "@/components/auth/server-session";

export default async function Home() {
    const session = await getServerSession();

    if (session.status === "error") {
        return <></>;
    }

    // Redirect to user's root folder
    redirect(`/folder/${session.data.user.rootFolderId}`);
}
