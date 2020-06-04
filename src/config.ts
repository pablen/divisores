import presets from './presets'

/**
 * A string pattern to create the URL from where to fetch a room configuration.
 * Uses the substring "{roomId}" as a placeholder for the actual room ID.
 */
export const roomsApiUrlPattern = [
  'https://firestore.googleapis.com/v1/projects/',
  process.env.REACT_APP_FIREBASE_PROJECT_NAME,
  '/databases/(default)/documents/rooms/{roomId}',
].join('')

/**
 * An amount of milliseconds to wait before triggering some actions, with the
 * intent of giving a more "natural" feel when the machine plays.
 */
export const aiPlayDelay = 600

/**
 * Default configuration used if no active room or used as base configuration
 * to be overriden by URL query parameters.
 */
export const defaultConfig = presets.del10.options

export const isDebugEnabled = process.env.REACT_APP_DEBUG === 'true'
