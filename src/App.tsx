import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MachineDetail from './pages/MachineDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/machines/:id" element={<MachineDetail />} />
    </Routes>
  )
}
