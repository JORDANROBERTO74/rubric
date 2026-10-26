import type { ComponentVisualState } from './types'

/** Debug-only: overlay `error` on a single indexed item when preview is enabled. */
export function resolvePreviewVisualState(
  visualState: ComponentVisualState,
  previewErrorStates: boolean,
  previewErrorIndex: number,
  itemIndex: number
): ComponentVisualState {
  if (previewErrorStates && itemIndex === previewErrorIndex) {
    return 'error'
  }
  return visualState
}
