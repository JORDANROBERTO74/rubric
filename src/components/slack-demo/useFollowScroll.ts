'use client'

import {
  useCallback,
  useEffect,
  useRef,
  type DependencyList
} from 'react'
import { FOLLOW_SCROLL_THRESHOLD_PX } from './constants'

export type UseFollowScrollOptions = {
  enabled: boolean
  reduceMotion?: boolean
  threshold?: number
}

function isNearBottom(element: HTMLElement, threshold: number): boolean {
  return element.scrollHeight - element.scrollTop - element.clientHeight <= threshold
}

/** Scroll only the panel container — never use scrollIntoView (it scrolls ancestor/page). */
function scrollContainerToBottom(
  container: HTMLElement,
  behavior: ScrollBehavior
): void {
  const top = Math.max(0, container.scrollHeight - container.clientHeight)
  container.scrollTo({ top, behavior })
}

export function useFollowScroll(
  deps: DependencyList,
  {
    enabled,
    reduceMotion = false,
    threshold = FOLLOW_SCROLL_THRESHOLD_PX
  }: UseFollowScrollOptions
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const userPinnedRef = useRef(false)

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior) => {
      if (!enabled || userPinnedRef.current) return
      const container = containerRef.current
      if (!container) return
      scrollContainerToBottom(container, behavior)
    },
    [enabled]
  )

  const onScroll = useCallback(() => {
    const element = containerRef.current
    if (!element) return
    userPinnedRef.current = !isNearBottom(element, threshold)
  }, [threshold])

  const resetFollow = useCallback(() => {
    userPinnedRef.current = false
  }, [])

  useEffect(() => {
    scrollToBottom(reduceMotion ? 'auto' : 'smooth')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller controls trigger list
  }, [enabled, reduceMotion, scrollToBottom, ...deps])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !enabled) return

    const observeTarget = container.firstElementChild ?? container
    const observer = new ResizeObserver(() => {
      if (!userPinnedRef.current) {
        scrollToBottom('auto')
      }
    })
    observer.observe(observeTarget)
    return () => observer.disconnect()
  }, [enabled, scrollToBottom])

  return { containerRef, bottomRef, onScroll, resetFollow }
}
