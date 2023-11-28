import { redirect } from "next/navigation";

import { getServerSession } from "@/components/auth/server-session";

export default async function Home() {
    const session = await getServerSession();

    if (session.status === "error") {
        // Redirect to login page
        redirect(`/login`);
    }

    // Redirect to user's root folder
    redirect(`/folder/${session.data.user.rootFolderId}`);
}
