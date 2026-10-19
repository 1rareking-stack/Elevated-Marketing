import { describe, expect, it } from 'vitest'
import { buildDeterministicPackage, parseCreativePackage } from '../lib/creative/engine'
import { campaignBriefSchema } from '../lib/creative/schema'

const brief = campaignBriefSchema.parse({
  name: 'Summer launch',
  product: 'Everwell botanical energy',
  audience: 'Creative professionals',
  objective: 'Drive trial',
  tone: 'Warm and optimistic',
  channels: ['Instagram', 'TikTok'],
  callToAction: 'Shop now',
  keyBenefit: 'Clear energy without the crash',
  proofPoint: 'Made with five botanical extracts',
  visualDirection: 'Sunlit, tactile, editorial close-ups',
})

describe('creative engine', () => {
  it('produces a structured production package totaling exactly 20 seconds', () => {
    const result = buildDeterministicPackage(brief)
    expect(result.storyboard).toHaveLength(5)
    expect(result.storyboard.reduce((total, scene) => total + scene.durationSeconds, 0)).toBe(20)
    expect(result.totalDurationSeconds).toBe(20)
  })

  it('is deterministic for the same brief', () => {
    expect(buildDeterministicPackage(brief)).toEqual(buildDeterministicPackage(brief))
  })

  it('rejects storyboards shorter than 20 seconds', () => {
    const invalid = buildDeterministicPackage(brief)
    invalid.storyboard[0].durationSeconds = 2
    expect(() => parseCreativePackage(invalid)).toThrow(/exactly 20 seconds/)
  })

  it('rejects duplicate or nonsequential scene ordering', () => {
    const invalid = buildDeterministicPackage(brief)
    invalid.storyboard[1].order = 1
    expect(() => parseCreativePackage(invalid)).toThrow(/unique and sequential/)
  })

  it('rejects a brief without at least one distribution channel', () => {
    expect(() => campaignBriefSchema.parse({ ...brief, channels: [] })).toThrow()
  })
})
