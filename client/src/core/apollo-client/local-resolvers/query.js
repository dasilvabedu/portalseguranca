import {
  getCurrentTimeFromWorldClock,
  getUserIdFromToken,
} from '../../../utils/auth'

export default {
  currentUserId: async (_object, _args, _context, _info) => {
    if (localStorage.getItem('token')) {
      let currentTime = await getCurrentTimeFromWorldClock()
      let userId = getUserIdFromToken(currentTime)
      return userId
    }

    return undefined
  }
}
