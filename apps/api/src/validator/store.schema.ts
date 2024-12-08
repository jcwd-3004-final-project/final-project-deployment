import { z as validate } from 'zod'

export const storeSchema = validate.object({
	store_name: validate.string().min(1, "Name is required"),
	address: validate.string().min(1, "Address is required"),
	latitude: validate.number().positive(""),
    longitude: validate.number().positive(""),
});
