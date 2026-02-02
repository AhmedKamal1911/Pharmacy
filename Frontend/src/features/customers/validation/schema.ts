import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 7, "Phone number is too short"),

  address: z.string().optional(),

  type: z.enum(["فرد", "شركة"]),

  isCashOnly: z.boolean(),

  balance: z.number().min(0, "Balance cannot be negative"),

  creditLimit: z.number().min(0, "Credit limit cannot be negative"),

  localDiscount: z.number().min(0).max(100),

  importDiscount: z.number().min(0).max(100),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
