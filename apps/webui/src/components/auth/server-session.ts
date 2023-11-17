import { cookies } from "next/headers";
import * as z from "zod";

import { env } from "@/env/env.mjs";

type GetServerSessionReturnType =
    | {
          status: "success";
          data: z.infer<typeof getSessionDetailsSchema>;
      }
    | {
          status: "error";
          error: Error | null;
      };

export async function getServerSession(): Promise<GetServerSessionReturnType> {
    const response = await fetch(`${env.NEXT_PUBLIC_OPENCLOUD_SERVER_URL}/v1/auth/session`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        return { status: "error", error: new Error("Failed to fetch data") };
    }

    const parsedSessionDetails = getSessionDetailsSchema.safeParse(await response.json());

    if (parsedSessionDetails.success === false) {
        return { status: "error", error: new Error("Failed to fetch data") };
    }

    return { status: "success", data: parsedSessionDetails.data };
}

const getSessionDetailsSchema = z.object({
    user: z.object({
        id: z.string(),
        username: z.string(),
        rootFolderId: z.string(),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
    }),
    accessTokenExpires: z.string().datetime(),
    refreshTokenExpires: z.string().datetime(),
});
