import * as z from "zod";

export const storeSchema = z.object({
    name: z.string(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    maxDeliveryDistance: z.number(),
});

