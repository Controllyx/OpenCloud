import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { folderDetailsUrl, folderContentsUrl, parseFolderDetails, parseFolderContents } from "./folder-fetch";
import { GridLayout } from "./_grid/core-layout";

export default async function FolderView({ params }: { params: { folderId: string } }) {
    const folderId = params.folderId;

    const queryClient = new QueryClient();

    const folderDetailsQuery = queryClient.prefetchQuery({
        queryKey: ["folder-details", folderId],
        queryFn: () => getFolderDetails(folderId),
    });
    const folderContentsQuery = queryClient.prefetchQuery({
        queryKey: ["folder-contents", folderId],
        queryFn: () => getFolderContents(folderId),
    });

    await Promise.all([folderDetailsQuery, folderContentsQuery]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <GridLayout folderId={folderId} />
        </HydrationBoundary>
    );
}

async function getFolderDetails(folderId: string) {
    const response = await fetch(`${folderDetailsUrl}${folderId}`, {
        headers: { Cookie: cookies().toString() },
    });

    return parseFolderDetails(response);
}

async function getFolderContents(folderId: string) {
    const response = await fetch(`${folderContentsUrl}${folderId}`, {
        headers: { Cookie: cookies().toString() },
    });

    return parseFolderContents(response);
}
