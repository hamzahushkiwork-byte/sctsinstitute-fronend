import { NavLink } from 'react-router-dom'

function NavBar() {
  const navStyle = {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd'
  }

  const linkStyle = {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  }

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#1976d2',
    color: '#fff'
  }

  return (
    <nav style={navStyle}>
      <NavLink
        to="/"
        style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
      >
        About Us
      </NavLink>
      {/* <NavLink 
        to="/services" 
        style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
      >
        Services
      </NavLink> */}
      <NavLink
        to="/courses-programs"
        style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
      >
        Courses & Programs
      </NavLink>
      <NavLink
        to="/contact"
        style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
      >
        Contact
      </NavLink>
    </nav>
  )
}

export default NavBar


