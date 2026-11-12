const endpointUrl =
  'https://script.google.com/macros/s/AKfycbxHrni6sXRLW2lRCHc-QMj1F9P1rv-n616UwXbKAudXhAbqQP9gdP6Qs5PlgEi5RlFA/exec'
let pendingRequest

export function loadPortfolioData() {
  if (pendingRequest) return pendingRequest

  pendingRequest = new Promise((resolve, reject) => {
    const callbackName = 'portfolioCallback'
    const script = document.createElement('script')
    let timeoutId
    let settled = false

    const cleanup = () => {
      window.clearTimeout(timeoutId)
      delete window[callbackName]
      script.remove()
      pendingRequest = undefined
    }

    const fail = (message) => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error(message))
    }

    window[callbackName] = (response) => {
      if (settled) return

      const data = response?.data ?? response
      if (response?.success === false || !data || typeof data !== 'object') {
        fail(response?.error || 'The portfolio data response was invalid.')
        return
      }

      settled = true
      cleanup()
      resolve({
        about: data.about && typeof data.about === 'object' ? data.about : {},
        skills: Array.isArray(data.skills) ? data.skills : [],
        projects: Array.isArray(data.projects) ? data.projects : [],
        achievements: Array.isArray(data.achievements) ? data.achievements : [],
        contact: Array.isArray(data.contact) ? data.contact : []
      })
    }

    script.onerror = () => {
      fail('Could not load portfolio data. Check the Apps Script deployment and try again.')
    }

    timeoutId = window.setTimeout(() => {
      fail('Loading portfolio data timed out. Please try again.')
    }, 15000)

    const url = new URL(endpointUrl)
    url.searchParams.set('callback', callbackName)
    script.src = url.toString()
    document.head.appendChild(script)
  })

  return pendingRequest
}
