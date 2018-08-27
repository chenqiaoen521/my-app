import AppStateClass from './app'

export const AppState = AppStateClass

export default {
	AppState
}

export const createStoreMap = () => {
  return {
    appStore: new AppState()
  }
}