import 'server-only'

import { buildCreativeSystemPrompt, parseCreativePackage } from './engine'
import type { CampaignBrief, CreativePackage } from './schema'

type ProviderResult = {
  package: CreativePackage
  provider: string
}

export async function generateWithConfiguredProvider(brief: CampaignBrief): Promise<ProviderResult | null> {
  const apiKey = process.env.AI_API_KEY
  const model = process.env.AI_MODEL
  if (!apiKey || !model) return null

  const endpoint = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions'
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 25_000)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildCreativeSystemPrompt() },
          {
            role: 'user',
            content: `Campaign brief:\n${JSON.stringify(brief)}\nReturn schemaVersion, title, strategy, concept, storyboard, totalDurationSeconds, and production.`,
          },
        ],
      }),
      signal: controller.signal,
      cache: 'no-store',
    })

    if (!response.ok) throw new Error(`Provider returned ${response.status}`)
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
    const content = payload.choices?.[0]?.message?.content
    if (!content) throw new Error('Provider returned no structured content')
    return { package: parseCreativePackage(JSON.parse(content)), provider: model }
  } finally {
    clearTimeout(timeout)
  }
}
