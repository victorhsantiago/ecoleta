import React from 'react'
import { FiLogIn } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import TheHeader from '../../components/TheHeader'

import './styles.css'

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <TheHeader />
        <main>
          <h1>Seu marketplace de resíduos.</h1>
          <p>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </p>
          <Link to="/create-point">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastre um ponto de coleta</strong>
          </Link>
        </main>
      </div>
    </div>
  )
}

export default Home
