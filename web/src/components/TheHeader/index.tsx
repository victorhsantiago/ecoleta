import React from 'react'
import { Link } from 'react-router-dom'

// import './styles.css'
import logo from '../../assets/logo.svg'

const CreatePoint = () => {
  return (
    <header>
      <Link to="/">
        <img src={logo} alt="Ecoleta" />
      </Link>
    </header>
  )
}

export default CreatePoint
