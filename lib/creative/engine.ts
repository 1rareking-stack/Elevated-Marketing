import { campaignBriefSchema, creativePackageSchema, type CampaignBrief, type CreativePackage } from './schema'

const sceneDurations = [3, 4, 5, 4, 4] as const

export function buildDeterministicPackage(input: CampaignBrief): CreativePackage {
  const brief = campaignBriefSchema.parse(input)
  const product = brief.product.replace(/[.!?]+$/, '')
  const packageValue: CreativePackage = {
    schemaVersion: '1.0',
    title: `${brief.name} — 20s master`,
    strategy: {
      coreIdea: `${brief.keyBenefit} becomes the memorable answer to a real audience moment.`,
      audienceTension: `${brief.audience} need a credible, immediate reason to change what they do now.`,
      promise: brief.keyBenefit,
      reasonToBelieve: brief.proofPoint || `${product} is designed specifically around that need.`,
    },
    concept: {
      hook: `What if ${brief.audience.toLowerCase()} had a better option?`,
      headline: `${brief.keyBenefit}.`,
      body: `${product} turns an everyday friction point into a simple, satisfying next step.`,
      callToAction: brief.callToAction,
    },
    storyboard: [
      {
        id: 'scene-1',
        order: 1,
        durationSeconds: sceneDurations[0],
        shot: `Open on the audience tension in a recognizable, close-up human moment. ${brief.visualDirection}`,
        onScreenText: 'You know this moment.',
        voiceover: `You know the moment when the old way stops working?`,
        transition: 'Hard cut on action',
        audioCue: 'Single percussive hit, then room tone',
      },
      {
        id: 'scene-2',
        order: 2,
        durationSeconds: sceneDurations[1],
        shot: `Reveal ${product} entering frame with tactile product detail.`,
        onScreenText: brief.keyBenefit,
        voiceover: `Meet ${product}: ${brief.keyBenefit.toLowerCase()}.`,
        transition: 'Match cut into product macro',
        audioCue: 'Music bed begins and builds',
      },
      {
        id: 'scene-3',
        order: 3,
        durationSeconds: sceneDurations[2],
        shot: 'Show the product in use across two fast, authentic situations.',
        onScreenText: brief.proofPoint || 'Designed for real life',
        voiceover: brief.proofPoint || `Made for the way your day actually moves.`,
        transition: 'Two rhythmic jump cuts',
        audioCue: 'Beat locks to each product interaction',
      },
      {
        id: 'scene-4',
        order: 4,
        durationSeconds: sceneDurations[3],
        shot: 'Return to the person, now confident and moving forward.',
        onScreenText: 'Feel the difference.',
        voiceover: `A small change that makes the whole moment feel different.`,
        transition: 'Slow push into hero framing',
        audioCue: 'Music opens into a bright resolve',
      },
      {
        id: 'scene-5',
        order: 5,
        durationSeconds: sceneDurations[4],
        shot: `End card with product, logo, benefit, and a single ${brief.callToAction} action.`,
        onScreenText: brief.callToAction,
        voiceover: `${brief.callToAction} with ${product}.`,
        transition: 'Clean brand lockup',
        audioCue: 'Sonic logo and clean tail',
      },
    ],
    totalDurationSeconds: 20,
    production: {
      aspectRatio: brief.channels.some((channel) => /tiktok|reels|instagram/i.test(channel)) ? '9:16' : '16:9',
      resolution: '1080 × 1920',
      frameRate: 30,
      captionsRequired: true,
      musicDirection: `${brief.tone}; modern instrumental with space for voiceover.`,
      voiceDirection: `Natural, conversational, and ${brief.tone.toLowerCase()}.`,
      assetChecklist: [
        'Primary logo (SVG or transparent PNG)',
        'Product hero image',
        'Two product-in-use clips',
        'Brand typeface or approved substitute',
        'Licensed music and sonic logo',
      ],
      complianceNotes: [
        'Verify every performance or product claim before publication.',
        'Confirm music, talent, and location usage rights.',
        'Keep captions inside platform-safe areas.',
      ],
    },
  }

  return creativePackageSchema.parse(packageValue)
}

export function buildCreativeSystemPrompt() {
  return [
    'You are a senior direct-response creative director.',
    'Return only JSON matching the provided schema.',
    'Produce exactly five sequential scenes totaling exactly 20 seconds.',
    'Use durations 3, 4, 5, 4, and 4 seconds.',
    'Never invent product claims. Mark unknown proof points as requiring verification.',
    'Make every field production-ready, specific, and concise.',
  ].join(' ')
}

export function parseCreativePackage(value: unknown) {
  return creativePackageSchema.parse(value)
}
