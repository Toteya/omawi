import { NavLink } from 'react-router-dom'
import '../App.css'

export default function Navbar() {
  return (
    <nav className="Nav">
      <NavLink to="/" className="NavBrand">
        <img src="/logo_icon.ico" alt="Omawi" />
      </NavLink>
      <div className="NavSpacer" />
      <div className="NavLinks">
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>
    </nav>
  )
}
