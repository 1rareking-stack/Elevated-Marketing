import { z } from 'zod'

export const campaignBriefSchema = z.object({
  name: z.string().trim().min(1).max(120),
  product: z.string().trim().min(1).max(2000),
  audience: z.string().trim().min(1).max(2000),
  objective: z.string().trim().min(1).max(300),
  tone: z.string().trim().min(1).max(300),
  channels: z.array(z.string().trim().min(1).max(50)).min(1).max(8),
  callToAction: z.string().trim().min(1).max(100),
  keyBenefit: z.string().trim().min(1).max(150),
  proofPoint: z.string().trim().max(500).default(''),
  visualDirection: z.string().trim().min(1).max(500),
})

export const sceneSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().min(1).max(20),
  durationSeconds: z.number().positive().max(20),
  shot: z.string().min(1).max(500),
  onScreenText: z.string().max(160),
  voiceover: z.string().max(500),
  transition: z.string().min(1).max(120),
  audioCue: z.string().min(1).max(160),
})

export const creativePackageSchema = z.object({
  schemaVersion: z.literal('1.0'),
  title: z.string().min(1).max(120),
  strategy: z.object({
    coreIdea: z.string().min(1).max(500),
    audienceTension: z.string().min(1).max(500),
    promise: z.string().min(1).max(500),
    reasonToBelieve: z.string().min(1).max(500),
  }),
  concept: z.object({
    hook: z.string().min(1).max(160),
    headline: z.string().min(1).max(160),
    body: z.string().min(1).max(500),
    callToAction: z.string().min(1).max(120),
  }),
  storyboard: z.array(sceneSchema).min(3).max(10),
  totalDurationSeconds: z.literal(20),
  production: z.object({
    aspectRatio: z.enum(['9:16', '1:1', '4:5', '16:9']),
    resolution: z.string().min(1),
    frameRate: z.number().int().min(24).max(60),
    captionsRequired: z.boolean(),
    musicDirection: z.string().min(1).max(300),
    voiceDirection: z.string().min(1).max(300),
    assetChecklist: z.array(z.string().min(1)).min(1).max(20),
    complianceNotes: z.array(z.string()).max(20),
  }),
}).superRefine((value, context) => {
  const duration = value.storyboard.reduce((sum, scene) => sum + scene.durationSeconds, 0)
  if (Math.abs(duration - 20) > Number.EPSILON) {
    context.addIssue({
      code: 'custom',
      path: ['storyboard'],
      message: `Storyboard must total exactly 20 seconds; received ${duration}.`,
    })
  }

  const orders = value.storyboard.map((scene) => scene.order)
  if (new Set(orders).size !== orders.length || !orders.every((order, index) => order === index + 1)) {
    context.addIssue({
      code: 'custom',
      path: ['storyboard'],
      message: 'Storyboard scene order must be unique and sequential.',
    })
  }
})

export type CampaignBrief = z.infer<typeof campaignBriefSchema>
export type CreativePackage = z.infer<typeof creativePackageSchema>
