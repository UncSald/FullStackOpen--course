import { useDispatch, useSelector } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"

const Anecdote = ({ anecdote, handleClick }) => {
  return (<li>
    <div>{anecdote.content}</div>
    <div>
    has {anecdote.votes}
    <button onClick={() => handleClick(anecdote.id)}>vote</button>
    </div>
  </li>)
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state).sort((a, b) => b.votes - a.votes)

  const vote = id => {
    dispatch(voteAnecdote( id ))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote.id)}
        />
      ))}
    </div>
  )
}

export default AnecdoteList