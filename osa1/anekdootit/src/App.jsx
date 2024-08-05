import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button
    onClick={handleClick}>
    {text}
  </button>
)

const MostVotes = ({ points, anecdotes }) => {
  const maxim = Math.max(...points)
  const location = points.findIndex((element) => element === maxim)
  return(
  <p>{anecdotes[location]}</p>
  )
}

const randomNumberInRange = (min, max) => {
  return Math.floor(Math.random()
      * (max - min + 1)) + min;
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoint] = useState([0,0,0,0,0,0,0,0])

  const handleNext = () => {
    setSelected(randomNumberInRange(0,7))
  }

  const handleVote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoint(copy)
  }

  return (
    <div>
      <h2>Anecdote of the day </h2>
        <li>{anecdotes[selected]}</li>
        <li>has {points[selected]} votes</li>
        <Button handleClick={handleVote} text='Vote'/>
        <Button handleClick={handleNext} text='Next anecdote'/>
      <h2>Anecdote with most votes</h2>
        <MostVotes points={points} anecdotes={anecdotes}/>
    </div>
  )
}

export default App
