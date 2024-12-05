const Header = ({ name }) => {
    return (
      <>
        <h2>{name}</h2>
      </>
    )
  }
  
  const Part = ({ name, exercises }) => {
    return (
      <>
          {name} {exercises}
      </>
    )
  }
  
  const Content = ({ parts }) => {
    return (
      <>
        {parts.map (part =>
            <p key={part.id}> <Part name={part.name} exercises={part.exercises}/></p>)}
      </>
    )
  }
  
  const Total = ({ parts }) => {
    const totalEx = (parts.map (part =>part.exercises))
    var sum = totalEx.reduce((temporary, value) => temporary + value,0)
    return (
      <h3>
          Total of exercises {sum}
      </h3>
    )
  }
  
  const Course = ({ courses }) => {
    return(
      <>
        <h1>Web development curriculum</h1>
        {courses.map (course => 
            <li key={course.id}>
                <Header name = {course.name}/>
                <Content parts = {course.parts}/>
                <Total parts = {course.parts}/>
            </li>
        )}
      </>
    )
  }

export default Course