// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content'

// 2. Import loader(s)
import { glob } from 'astro/loaders'

// 3. Define your collection(s)
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
  }),
})

const educational = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/educational' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['rules', 'strategies', 'responsible-gambling', 'odds-probability', 'risk-education', 'tools', 'support', 'family']),
    relatedVariant: z.array(z.enum(['european', 'american', 'french'])),
    authorCredentials: z.object({
      name: z.string(),
      title: z.string(),
      credentials: z.array(z.string()),
    }),
    seoKeywords: z.array(z.string()),
    lastUpdated: z.coerce.date(),
    readingTime: z.number(),
    featured: z.boolean().default(false),
    responsibleGambling: z.boolean().default(true),
    // New safety-focused fields
    rouletteSpecific: z.boolean().default(false),
    supportLevel: z.enum(['educational', 'moderate-concern', 'crisis']).default('educational'),
    safetyPriority: z.number().min(1).max(10).default(5),
    crisisKeywords: z.array(z.string()).default([]),
  }),
});

// New safety content collection specifically for Safe Gaming Center
const safetyContent = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/safety' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
    category: z.enum(['risk-education', 'tools', 'support', 'family']),
    rouletteSpecific: z.boolean(),
    author: z.object({
      name: z.string(),
      credentials: z.string(),
    }),
    supportLevel: z.enum(['educational', 'moderate-concern', 'crisis']),
    publishDate: z.coerce.date(),
    lastUpdated: z.coerce.date(),
    tags: z.array(z.string()),
    readingTime: z.number(),
    seoKeywords: z.array(z.string()),
    // Safety-specific fields
    riskLevel: z.enum(['low', 'medium', 'high']).optional(),
    interventionType: z.array(z.enum(['educational', 'warning', 'redirect', 'crisis'])).default(['educational']),
    relatedResources: z.array(z.string()).default([]),
    followUpRecommended: z.boolean().default(false),
    professionalReviewRequired: z.boolean().default(false),
  }),
});

const casinos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/casinos' }),
  schema: z.object({
    casinoId: z.string(),
    name: z.string(),
    supportedVariants: z.array(z.enum(['european', 'american', 'french'])),
    features: z.object({
      liveDealers: z.boolean(),
      mobileApp: z.boolean(),
      bonusOffering: z.string(),
      reputation: z.number().min(1).max(10),
    }),
    affiliateUrl: z.string().url(),
    geographicAvailability: z.array(z.string()),
    conversionPriority: z.number(),
    lastVerified: z.coerce.date(),
  }),
});

// 4. Export a single `collections` object to register you collection(s)
export const collections = { projects, educational, casinos, safetyContent }
