import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { status, user, logout } = useAuth()
  const authenticated = (status === 'authenticated') ? true : false
  
  return (
    <nav className="Nav">
      <NavLink to="/" className="NavBrand">
        <img src="/logo_icon.ico" alt="Omawi" />
      </NavLink>
      <div className="NavSpacer" />
      <div className="NavLinks">
        {authenticated && (
          <>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/" onClick={logout}>Logout</NavLink>
          </>
        )}
        {!authenticated && <NavLink to="/login">Login</NavLink>}
        <NavLink to="/about">About</NavLink>
      </div>
    </nav>
  )
}
