import { parseManifest, type Manifest } from './Manifest'
import type { FSV, FSVTrack } from './FSV'

/**
 * Demuxes from fsv format.
 */
export const Demuxer = {
  demux
}

/**
 * Demuxes fsv data into an FSV object ready to decode.
 */
function demux(data: ArrayBuffer): FSV {
  const footer = new DataView(data, data.byteLength - 4)
  const alphaOffset = footer.getUint32(0, true)

  const color = demuxTrack(data, 0, (alphaOffset || data.byteLength) - 4)

  if (!alphaOffset) {
    return color
  }

  const alpha = demuxTrack(data, alphaOffset, data.byteLength - 8)

  return {
    ...color,
    alpha
  }
}

function demuxTrack(
  data: ArrayBuffer,
  offset: number,
  length: number
): FSVTrack {
  const manifest = extractManifest(data, offset, length)

  const fsv: FSVTrack = {
    config: manifest.config,
    width: manifest.width,
    height: manifest.height,
    duration: manifest.duration,
    length: manifest.frames.length,
    indices: new Map(),
    frames: []
  }

  let keyIndex: number = 0

  for (let index = 0; index < manifest.frames.length; index++) {
    const frame = manifest.frames[index]

    if (frame.type === 'key') {
      keyIndex = index
    }

    fsv.indices.set(frame.timestamp, index)

    fsv.frames.push({
      keyIndex,
      chunk: new EncodedVideoChunk({
        type: frame.type,
        timestamp: frame.timestamp,
        data: new Uint8Array(data, frame.offset + offset, frame.byteLength)
      })
    })
  }

  return fsv
}

function extractManifest(
  data: ArrayBuffer,
  offset: number,
  length: number
): Manifest {
  const footer = new DataView(data, length - 4)
  offset += footer.getUint32(0, true)
  length -= 4 + offset

  return parseManifest(
    new TextDecoder().decode(new Uint8Array(data, offset, length))
  )
}
