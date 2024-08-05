import { useState } from 'react'



const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>
      {text}
    </button>
  )

const StatisticsLine = ({ text, value }) => {
  if (text === 'positive') {
    return (
      <tr>
        <td>{text}</td> 
        <td>{value} %</td>
      </tr>
    )
  }
  return (
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>
  )
}

const Statistics = (props) => {

  if (props.all === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <table>
      <tbody>
        <StatisticsLine text='good' value={props.good}/>
        <StatisticsLine text='neutral' value={props.neutral}/>
        <StatisticsLine text='bad' value={props.bad}/>
        <StatisticsLine text='all' value={props.all}/>
        <StatisticsLine text='average' value={(props.good - props.bad)/(props.all)}/>
        <StatisticsLine text='positive' value={props.good/(props.all)*100}/>
      </tbody>
    </table>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  const handleGood = () => {
    setAll(all + 1)
    setGood(good + 1)
  }

  const handleNeutral = () => {
    setAll(all + 1)
    setNeutral(neutral + 1)
  }

  const handleBad = () => {
    setAll(all + 1)
    setBad(bad + 1)
  }

  return (
    <div>
      <div>
        <h2>give feedback</h2>
          <Button handleClick={handleGood} text='good'/>
          <Button handleClick={handleNeutral} text='neutral'/>
          <Button handleClick={handleBad} text='bad'/>
      </div>
      <div>
        <h2>statistics</h2>
      </div>
      <Statistics good = {good} neutral = {neutral} bad = {bad} all = {all}/>
    </div>
  )
}

export default App