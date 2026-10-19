'use client'

export default function StudioError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="state-page" role="alert">
      <span className="kicker">STUDIO UNAVAILABLE</span>
      <h1>We couldn’t open your workspace.</h1>
      <p>Your work is still safe. Check your connection and try again.</p>
      <button className="button button-primary" onClick={reset}>Try again</button>
    </main>
  )
}
