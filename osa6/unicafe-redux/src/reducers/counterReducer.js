const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      const incrGood = {
        good: state.good +1,
        ok: state.ok,
        bad: state.bad 
      }
      return incrGood
    case 'OK':
      const incrOk = {
        good: state.good,
        ok: state.ok +1,
        bad: state.bad 
      }
      return incrOk
    case 'BAD':
      const incrBad = {
        good: state.good,
        ok: state.ok,
        bad: state.bad +1
      }
      return incrBad
    case 'RESET':
      const reset = {
        good: 0,
        ok: 0,
        bad: 0
      }
      return state
    default:
      return state
  }
}

export default counterReducer
