import type { FSVTrack } from './FSV'

/**
 * Generic interface to manipulate a fsv video.
 */
export interface Video extends Pick<FSVTrack,
  | 'width'
  | 'height'
  | 'duration'
  | 'length'
>{
  /**
   * Whether the video has an alpha track.
   */
  readonly alpha: boolean

  /**
   * The index of the current frame.
   */
  readonly currentFrame?: number

  /**
   * The index of the frame that is currently being decoded or is pending to be
   * decoded.
   */
  readonly pendingFrame?: number

  /**
   * Seeks to a specific time in the video.
   *
   * @param time The time in seconds to seek to.
   */
  seek(time: number): void

  /**
   * Seeks to a specific progress in the video.
   *
   * @param progress The progress to seek to, between 0 and 1.
   */
  progress(progress: number): void

  /**
   * Seeks to a specific frame index.
   *
   * @param index The index of the frame to seek to.
   */
  set(index: number): void
}
