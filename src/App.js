import React, { useEffect, useReducer } from 'react'
import { API } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react'

const initialState = {
  isLoading: true,
  coins: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'SETCOINS':
      return { ...state, coins: action.coins, isLoading: false }
    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  async function getData() {
    try {
      // const data = await API.get('cryptoapi', '/coins')
      const data = await API.get('cryptoapi', '/coins?limit=10&start=100')
      console.log('data from Lambda REST API: ', data)
      dispatch({ type: 'SETCOINS', coins: data.coins })
    } catch (err) {
      console.log('error fetching data..', err)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  if (state.isLoading) return <h1>Loading...</h1>

  return (
    <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
      {state.coins.map((c, i) => (
        <div key={i}>
          <h2>{c.name}</h2>
          <p>{c.price_usd}</p>
        </div>
      ))}
    </div>
  )
}

export default withAuthenticator(App, { includeGreetings: true })
