/**
 * ============================================================
 *  CUSTOM ANIMATED BEE SLOT
 * ============================================================
 *  Another coder can drop their OWN animated bee in here.
 *
 *  HOW TO REPLACE IT:
 *  1. Put your bee asset in the /public folder, e.g.
 *       /public/my-bee.gif        (animated GIF)
 *       /public/my-bee.png        (static image)
 *       /public/my-bee.json       (Lottie animation)
 *  2. Swap the contents of the `return (...)` below for your bee.
 *
 *  Examples:
 *  --------------------------------------------------
 *  // Animated GIF:
 *  return <img src="/my-bee.gif" alt="Animated bee" className={className} />
 *
 *  // A Lottie animation (after `npm i lottie-react`):
 *  //   import Lottie from "lottie-react"
 *  //   import beeData from "@/public/my-bee.json"
 *  return <Lottie animationData={beeData} loop className={className} />
 *
 *  // Your own CSS/JSX animated component:
 *  return <MyAnimatedBee className={className} />
 *  --------------------------------------------------
 *
 *  `className` controls the size/position on the page — it is passed
 *  in from app/page.tsx, so you usually do NOT need to change it here.
 * ============================================================
 */
export function CustomBee({ className }: { className?: string }) {
  // 👇 REPLACE the element below with your own animated bee.
  // This placeholder is a gently floating emoji bee so the slot is visible.
  return (
    <span
      role="img"
      aria-label="Bee"
      className={className}
      style={{
        display: 'inline-block',
        fontSize: '2.5rem',
        lineHeight: 1,
        animation: 'bee-float 3s ease-in-out infinite',
      }}
    >
      🐝
    </span>
  )
}
