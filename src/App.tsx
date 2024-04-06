import './App.css'
import { useEffect } from 'react';

function App() {

  useEffect(() => {document.title = "Rusty Rhino"; }, [])

  return (
    <>
      <h1>Rusty Rhino</h1>
    </>
  )
}

export default App
