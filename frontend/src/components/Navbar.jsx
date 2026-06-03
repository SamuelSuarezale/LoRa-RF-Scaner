import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        LORA <span>RF</span> SCANNER
      </div>
      <div className="navbar-links">
        <Link to="/">HOME</Link>
        <Link to="/measurements">SCANNER</Link>
      </div>
    </nav>
  )
}

export default Navbar