import React from 'react'

const reducer = (acc, cv) => {
    console.log(acc)
    return(acc + cv.exercises)
}

const Total = (props) => {
    return(
      <p>Number of exercises {props.parts.reduce(reducer, 0)}</p>
    )
  }

export default Total