'use client'

/**
 * LEGAL + CREATOR pages — in-app versions of Privacy, Terms and
 * Meet the Creator (links to the full pages on the old site).
 */
import { useApp } from '@/lib/store'

const PC_SITE = 'https://studyhive.co.za' // 👈 set your real site URL here

export function LegalScreen({ page }: { page: 'privacy' | 'terms' | 'creator' }) {
  const { go } = useApp()

  if (page === 'privacy') {
    return (
      <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <div className="px-7 pt-8">
          <h2 className="text-xl font-bold text-foreground">🔒 Privacy Policy</h2>
          <div className="mt-3 space-y-3 text-sm font-medium leading-relaxed text-brown">
            <p>
              Study Hive keeps <b>all of your data on this device</b>. There are no accounts, no
              cloud sync and no tracking — everything you type stays in your own browser storage.
            </p>
            <p>
              The only network requests the app makes are: the weather chip (city weather), Google
              Fonts for the look, and your optional backup downloads (which you save yourself).
            </p>
            <p>
              You can export your data any time in Settings and delete it with one tap. That is the
              whole policy — short because there is nothing to hide.
            </p>
          </div>
          <a
            href={`${PC_SITE}/study-hive-privacy-policy.html`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-base font-semibold text-honey-deep underline underline-offset-4"
          >
            Full privacy policy →
          </a>
        </div>
      </div>
    )
  }

  if (page === 'terms') {
    return (
      <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <div className="px-7 pt-8">
          <h2 className="text-xl font-bold text-foreground">📜 Terms of Service</h2>
          <div className="mt-3 space-y-3 text-sm font-medium leading-relaxed text-brown">
            <p>
              Study Hive is a study companion. Use it to focus, plan and grow — that is what it is
              for. The hive may not be copied, cloned, rebranded or resold without written
              permission from the creator.
            </p>
            <p>
              Your study data belongs to you. We cannot see it, sell it or share it, because it
              never leaves your device.
            </p>
            <p>
              Take breaks, drink water, and remember the app works for you — not the other way
              around.
            </p>
          </div>
          <a
            href={`${PC_SITE}/study-hive-terms-of-service.html`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-base font-semibold text-honey-deep underline underline-offset-4"
          >
            Full terms →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8 text-center">
        <p className="text-6xl" aria-hidden="true">👑</p>
        <h2 className="mt-3 text-xl font-bold text-foreground">Meet the Creator</h2>
        <div className="mx-auto mt-4 max-w-xs rounded-2xl bg-greeting/60 px-6 py-5">
          <p className="text-lg font-bold text-foreground">Omphemetse Mogale</p>
          <p className="mt-1 text-sm font-medium leading-relaxed text-greeting-foreground">
            Built the hive from one countdown to a whole study world — for students who need
            discipline with kindness. 🐝
          </p>
        </div>
        <a
          href="mailto:omphemetse.mogale0409@gmail.com?subject=Study%20Hive"
          className="mt-5 inline-block text-base font-semibold text-honey-deep underline underline-offset-4"
        >
          omphemetse.mogale0409@gmail.com
        </a>
        <p className="mt-3 text-sm font-semibold text-brown">
          Feedback, bugs, collabs and school use — the hive inbox is open.
        </p>
        <button
          type="button"
          onClick={() => go('home')}
          className="mt-5 rounded-2xl bg-honey px-6 py-3 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
        >
          Back to the hive
        </button>
      </div>
    </div>
  )
}
