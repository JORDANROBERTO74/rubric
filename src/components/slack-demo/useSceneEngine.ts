'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import {
  getElapsedMsUpTo,
  getSceneState,
  LAST_SCENE_INDEX,
  progressFromPlayheadMs,
  SCENE_SEQUENCE,
  TOTAL_ACTIVE_MS
} from './constants'
import type { SlackRevenueDemoState } from './types'

type UseSceneEngineOptions = {
  /** When set, overrides `prefers-reduced-motion` from the system. */
  reduceMotion?: boolean
  /** Fired when the last scene (`complete`) finishes; parent may call `replay()` to loop. */
  onRunComplete?: () => void
}

export function useSceneEngine(options: UseSceneEngineOptions = {}) {
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = options.reduceMotion ?? !!prefersReducedMotion
  const onRunCompleteRef = useRef(options.onRunComplete)

  useEffect(() => {
    onRunCompleteRef.current = options.onRunComplete
  }, [options.onRunComplete])
  const initialIndex = reduceMotion ? LAST_SCENE_INDEX : 0
  const initialPlaying = !reduceMotion

  const [sceneIndex, setSceneIndex] = useState(initialIndex)
  const [isPlaying, setIsPlaying] = useState(initialPlaying)
  const [playheadMs, setPlayheadMs] = useState(() =>
    reduceMotion && initialIndex >= LAST_SCENE_INDEX
      ? TOTAL_ACTIVE_MS
      : getElapsedMsUpTo(initialIndex)
  )
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sceneEnteredAtRef = useRef(Date.now())
  const pausedSceneElapsedRef = useRef(0)
  const sceneIndexRef = useRef(sceneIndex)
  const isPlayingRef = useRef(isPlaying)

  useEffect(() => {
    sceneIndexRef.current = sceneIndex
  }, [sceneIndex])

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const syncPlayheadToScene = useCallback((index: number, sceneElapsed = 0) => {
    const step = SCENE_SEQUENCE[index]
    const cap = step ? Math.min(sceneElapsed, step.durationMs) : 0
    setPlayheadMs(Math.min(getElapsedMsUpTo(index) + cap, TOTAL_ACTIVE_MS))
  }, [])

  const currentState: SlackRevenueDemoState = getSceneState(sceneIndex)

  const progress = progressFromPlayheadMs(playheadMs)

  const pause = useCallback(() => {
    pausedSceneElapsedRef.current = Date.now() - sceneEnteredAtRef.current
    clearTimer()
    setIsPlaying(false)
  }, [clearTimer])

  const replay = useCallback(() => {
    clearTimer()
    sceneEnteredAtRef.current = Date.now()
    pausedSceneElapsedRef.current = 0
    setSceneIndex(0)
    setPlayheadMs(0)
    setIsPlaying(true)
  }, [clearTimer])

  const stepForward = useCallback(() => {
    clearTimer()
    setSceneIndex(prev => Math.min(prev + 1, LAST_SCENE_INDEX))
  }, [clearTimer])

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause()
      return
    }
    if (sceneIndex >= LAST_SCENE_INDEX) {
      replay()
      return
    }
    sceneEnteredAtRef.current = Date.now() - pausedSceneElapsedRef.current
    setIsPlaying(true)
  }, [isPlaying, sceneIndex, pause, replay])

  useEffect(() => {
    if (!reduceMotion) return

    if (isPlayingRef.current) {
      pausedSceneElapsedRef.current = Date.now() - sceneEnteredAtRef.current
    }
    clearTimer()
    setIsPlaying(false)

    const index = sceneIndexRef.current
    if (index >= LAST_SCENE_INDEX) {
      setPlayheadMs(TOTAL_ACTIVE_MS)
    } else {
      syncPlayheadToScene(index, pausedSceneElapsedRef.current)
    }
  }, [reduceMotion, clearTimer, syncPlayheadToScene])

  useEffect(() => {
    sceneEnteredAtRef.current = Date.now()
    pausedSceneElapsedRef.current = 0
  }, [sceneIndex])

  useEffect(() => {
    if (!isPlaying || reduceMotion) {
      if (!reduceMotion) {
        const step = SCENE_SEQUENCE[sceneIndex]
        const finishedLastScene =
          sceneIndex >= LAST_SCENE_INDEX &&
          step != null &&
          pausedSceneElapsedRef.current >= step.durationMs

        if (finishedLastScene) {
          setPlayheadMs(TOTAL_ACTIVE_MS)
        } else {
          syncPlayheadToScene(sceneIndex, pausedSceneElapsedRef.current)
        }
      }
      return
    }

    let raf = 0
    const tick = () => {
      const step = SCENE_SEQUENCE[sceneIndex]
      const elapsed = Date.now() - sceneEnteredAtRef.current
      const cap = step ? Math.min(elapsed, step.durationMs) : 0
      setPlayheadMs(Math.min(getElapsedMsUpTo(sceneIndex) + cap, TOTAL_ACTIVE_MS))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isPlaying, sceneIndex, reduceMotion, syncPlayheadToScene])

  useEffect(() => {
    if (!isPlaying || reduceMotion) {
      clearTimer()
      return
    }

    const step = SCENE_SEQUENCE[sceneIndex]
    if (!step) {
      clearTimer()
      return
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null
      if (sceneIndex >= LAST_SCENE_INDEX) {
        pausedSceneElapsedRef.current = step.durationMs
        setPlayheadMs(TOTAL_ACTIVE_MS)
        const onComplete = onRunCompleteRef.current
        if (onComplete) {
          onComplete()
          return
        }
        setIsPlaying(false)
        return
      }
      setSceneIndex(prev => prev + 1)
    }, step.durationMs)

    return clearTimer
  }, [sceneIndex, isPlaying, reduceMotion, clearTimer])

  useEffect(() => {
    return clearTimer
  }, [clearTimer])

  return {
    currentState,
    sceneIndex,
    isPlaying,
    progress,
    pause,
    replay,
    stepForward,
    togglePlayPause
  }
}
