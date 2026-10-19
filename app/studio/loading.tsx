export default function StudioLoading() {
  return (
    <main className="state-page" aria-busy="true" aria-live="polite">
      <div className="state-spinner" />
      <h1>Opening your studio…</h1>
      <p>Refreshing your secure session and projects.</p>
    </main>
  )
}
