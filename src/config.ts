import presets from './presets'

/**
 * Default configuration used if no active room or used as base configuration
 * to be overriden by URL query parameters.
 */
export const defaultConfig = presets.cartas3.options

export const isDebugEnabled = process.env.REACT_APP_DEBUG === 'true'
