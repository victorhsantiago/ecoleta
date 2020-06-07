import React from 'react'
import { FiCheckCircle } from 'react-icons/fi'

import './styles.css'

const ConfirmationScreen = () => (
  <>
    <div className="confirmation">
      <div className="confirmation__wrapper">
        <FiCheckCircle size={48} color="#34cb79" />
        <p className="confirmation__text">Cadastro realizado!</p>
      </div>
    </div>
  </>
)

export default ConfirmationScreen
