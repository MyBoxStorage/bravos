import { z } from 'zod';

export const generateStampSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Prompt deve ter no mínimo 10 caracteres')
    .max(500, 'Prompt deve ter no máximo 500 caracteres'),
  uploadedImage: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith('data:image/'),
      'Imagem deve ser base64 válida'
    ),
});

export type GenerateStampInput = z.infer<typeof generateStampSchema>;
