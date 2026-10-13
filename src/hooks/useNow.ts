import { useSyncExternalStore } from 'react'

// One shared clock for every component that shows live opening status.
const TICK_MS = 15_000
let now = Date.now()
let timer: number | undefined
const listeners = new Set<() => void>()

function tick() {
  now = Date.now()
  listeners.forEach((listener) => listener())
}

function onVisibilityChange() {
  if (document.visibilityState === 'visible') tick()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1) {
    tick()
    timer = window.setInterval(tick, TICK_MS)
    document.addEventListener('visibilitychange', onVisibilityChange)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }
}

/** Current timestamp, refreshed every 15 s and whenever the tab becomes visible again. */
export function useNow(): number {
  return useSyncExternalStore(subscribe, () => now)
}

export function useYear(): number {
  return new Date(useNow()).getFullYear()
}
