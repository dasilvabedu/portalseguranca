export function namespacedTokenKey() {
  let splitLocation = window.location.pathname.split('/')

  return `${splitLocation[1]}/token`
}

export async function getCurrentTimeFromWorldClock() {
  let currentTime = null
  try {
    let response = await fetch('http://worldclockapi.com/api/json/utc/now')
    let json = await response.json()

    if (!json.currentDateTime) {
      throw Error('World clock API has returned a valid json but with an unexpected format')
    }

    currentTime = new Date(json.currentDateTime)
  } catch (e) {
    console.warn(e)
    currentTime = new Date()
  }

  return currentTime
}

export function getUserIdFromToken(currentTime = new Date()) {
  try {
    let token = localStorage.getItem('token')
    let claims = JSON.parse(
      atob(token.split('.')[1])
    )

    let expirationDate = new Date(claims.exp * 1000)

    if (currentTime.getTime() > expirationDate.getTime()) {
      localStorage.removeItem('token')
      return null
    }

    return claims.sub
  } catch (e) {
    localStorage.removeItem('token')
    return null
  }
}
