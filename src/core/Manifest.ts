import type { FSVTrack } from './FSV'

/**
 * Manifest containing video informations to decode and render the fsv format.
 */
export interface Manifest extends Pick<FSVTrack,
  | 'config'
  | 'width'
  | 'height'
  | 'duration'
> {
  /**
   * The video frames metadata.
   */
  frames: ManifestFrame[]
}

/**
 * Metadata about a video frame.
 */
export interface ManifestFrame {
  /**
   * The byte offset of the frame in the video data.
   */
  offset: number

  /**
   * The byte length of the frame in the video data.
   */
  byteLength: number

  /**
   * The timestamp of the frame in microseconds.
   */
  timestamp: number

  /**
   * The type of the frame.
   */
  type: 'key' | 'delta'
}

/**
 * Serialized version of a manifest that can be safely stringified and encoded
 * into the fsv format.
 */
export interface SerializedManifest extends Omit<Manifest,
  | 'config'
  | 'frames'
> {
  config: SerializedVideoDecoderConfig
  frames: number[]
}

/**
 * Serialized version of a VideoDecoderConfig.
 */
export interface SerializedVideoDecoderConfig extends Omit<VideoDecoderConfig,
  'description'
> {
  description?: number[]
}

/**
 * Stringifies a manifest into a serialized string that can be encoded into
 * the fsv format.
 *
 * @param manifest The manifest to stringify.
 *
 * @return A stringified version of the manifest.
 */
export function stringifyManifest(manifest: Manifest): string {
  return JSON.stringify(serializeManifest(manifest))
}

/**
 * Parses a serialized manifest from a serialized string.
 *
 * @param string The stringified manifest to parse.
 *
 * @return The parsed manifest.
 */
export function parseManifest(string: string): Manifest {
  return deserializeManifest(JSON.parse(string))
}

/**
 * Serializes a manifest into a format that can be safely stringified and
 * encoded.
 *
 * @param manifest The manifest to serialize.
 *
 * @return A serialized version of the manifest.
 */
export function serializeManifest(manifest: Manifest): SerializedManifest {
  return {
    ...manifest,
    config: serializeConfig(manifest.config),
    frames: serializeFrames(manifest.frames)
  }
}

/**
 * Deserializes a manifest from a serialized version.
 *
 * @param manifest The serialized manifest to deserialize.
 *
 * @return The deserialized manifest.
 */
export function deserializeManifest(manifest: SerializedManifest): Manifest {
  return {
    ...manifest,
    config: deserializeConfig(manifest.config),
    frames: deserializeFrames(manifest.frames)
  }
}

function serializeConfig(
  config: VideoDecoderConfig
): SerializedVideoDecoderConfig {
  return {
    ...config,
    description: config.description && [...(config.description as Uint8Array)]
  }
}

function deserializeConfig(
  config: SerializedVideoDecoderConfig
): VideoDecoderConfig {
  return {
    ...config,
    description: config.description
      ? new Uint8Array(config.description)
      : undefined
  }
}

function serializeFrames(frames: ManifestFrame[]): number[] {
  return frames.flatMap(frame => [
    frame.offset,
    frame.byteLength,
    frame.timestamp,
    frame.type === 'key' ? 1 : 0
  ])
}

function deserializeFrames(frames: number[]): ManifestFrame[] {
  const result: ManifestFrame[] = []

  for (let i = 0; i < frames.length; i += 4) {
    result.push({
      offset: frames[i],
      byteLength: frames[i + 1],
      timestamp: frames[i + 2],
      type: frames[i + 3] ? 'key' : 'delta'
    })
  }

  return result
}
