import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [best, setBest] = useState(0)
  const [points, setPoints] = useState(new Array(props.anecdotes.length+1).join('0').split('').map(parseFloat))

  const pickOne = () => {
    setSelected(Math.floor(Math.random() * props.anecdotes.length))
  }

  const vote = () => {
    const copy = [...points]

    copy[selected] += 1
    setPoints(copy)
    setBest(copy.indexOf(Math.max(...copy)))
  }
  debugger
  return (
    <div>
      <h1>Anecdote of the day</h1>
      {props.anecdotes[selected]}
      <div>has {points[selected]} votes</div>
      <div>
        <Button onClick={pickOne} text='pick another' />
        <Button onClick={vote} text='vote' />
      </div>
      <h1>Anecdote with most votes</h1>
      {props.anecdotes[best]}
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)