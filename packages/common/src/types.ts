import z from "zod";

export const SignupSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }).trim(),
    password: z
        .string()
        .min(6, { message: 'Be at least 6 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Contain at least one special character.',
        })
        .trim()
});

export const SigninSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(6, { message: 'Be at least 6 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Contain at least one special character.',
        })
        .trim()
});

export const CreateRoomSchema = z.object({
    name: z.string().min(3, { message: 'Room name must be at least 3 characters long.' }).trim(),
});

export const GetChatSchema = z.object({
    roomId: z.string()
})

export const GetRoomBySlug = z.object({
    slug: z.string()
})