import mixpanel from 'mixpanel-browser'

export function initMixpanel() {
  if (typeof window === 'undefined') {
    return
  }

  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? '090356d730eb3f9cfbe474d039f13716';
  if (!token) {
    console.warn('NEXT_PUBLIC_MIXPANEL_TOKEN is not set')
    return
  }

  mixpanel.init(token, {
    debug: process.env.NODE_ENV === 'development',
    track_pageview: true,
    persistence: 'localStorage',
  })
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    mixpanel.track(eventName, {
      timestamp: new Date().toISOString(),
      ...properties,
    })
  } catch (error) {
    console.error('Failed to track event:', error)
  }
}

export function setUserProperties(properties: Record<string, unknown>) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    mixpanel.register(properties)
  } catch (error) {
    console.error('Failed to set user properties:', error)
  }
}

export function identifyUser(userId: string) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    mixpanel.identify(userId)
  } catch (error) {
    console.error('Failed to identify user:', error)
  }
}
