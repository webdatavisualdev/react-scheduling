export const initialState = {
  user: null,
}

export const appReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'setUser':
      return {
        ...state,
        user: action.payload
      }
  }
}