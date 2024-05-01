import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='w-full p-3 border flex gap-12 justify-center bg-sky-300'>
      <h1>JD Blog</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
