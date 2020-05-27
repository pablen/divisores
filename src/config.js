import presets from './presets'

export const roomsApiUrlPattern = [
  'https://firestore.googleapis.com/v1/projects/',
  process.env.REACT_APP_FIREBASE_PROJECT_NAME,
  '/databases/(default)/documents/rooms/{roomId}',
].join('')
export const isDebugEnabled = process.env.REACT_APP_DEBUG === 'true'
export const defaultConfig = presets.del10.options
export const aiPlayDelay = 600
