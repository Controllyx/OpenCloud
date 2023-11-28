import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const getDetailsQuerySchema = z.object({
    fileId: z.string({
        required_error: "File ID is required",
        invalid_type_error: "File ID must be a string",
    }),
});

const getDetailsResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    ownerId: z.string(),
    parentId: z.string(),
    fileType: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

const getFileParamsSchema = z.object({
    fileId: z.string({
        required_error: "File ID is required",
        invalid_type_error: "File ID must be a string",
    }),
});

const getThumbnailParamsSchema = z.object({
    fileId: z.string({
        required_error: "File ID is required",
        invalid_type_error: "File ID must be a string",
    }),
});

const downloadFileParamsSchema = z.object({
    fileId: z.string({
        required_error: "File ID is required",
        invalid_type_error: "File ID must be a string",
    }),
});

const deleteFileQuerySchema = z.object({
    fileId: z.string({
        required_error: "File ID is required",
        invalid_type_error: "File ID must be a string",
    }),
});

const deleteFileResponseSchema = z.object({
    status: z.string(),
    message: z.string(),
});

export type GetDetailsQuerystring = z.infer<typeof getDetailsQuerySchema>;
export type GetFileParams = z.infer<typeof getFileParamsSchema>;
export type GetThumbnailParams = z.infer<typeof getThumbnailParamsSchema>;
export type DownloadFileParams = z.infer<typeof downloadFileParamsSchema>;
export type DeleteFileQuerystring = z.infer<typeof deleteFileQuerySchema>;

export const { schemas: fsSchemas, $ref } = buildJsonSchemas(
    {
        getDetailsQuerySchema,
        getDetailsResponseSchema,
        getFileParamsSchema,
        getThumbnailParamsSchema,
        downloadFileParamsSchema,
        deleteFileQuerySchema,
        deleteFileResponseSchema,
    },
    { $id: "FS" },
);
