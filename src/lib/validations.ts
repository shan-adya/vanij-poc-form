import * as z from "zod";

export const detailsFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  company: z.string().min(1, "Company name is required"),
  designation: z.string().min(1, "Designation is required"),
  useCase: z.string().min(1, "Use case description is required"),
});

export type DetailsFormValues = z.infer<typeof detailsFormSchema>;