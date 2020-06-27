import {
  toast
} from 'react-toastify'
import _ from 'lodash'

export function treatError(error) {
  console.error(error)

  if (error.graphQLErrors) {
    _.each(error.graphQLErrors, (e) => {
      toast.error(e.message)
    })
  } else {
    toast.error('Ocorreu um erro desconhecido')
  }
}
