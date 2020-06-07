import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { useHistory } from 'react-router-dom'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import axios from 'axios'
import api from '../../services/api'

import TheHeader from '../../components/TheHeader'
import Dropzone from '../../components/Dropzone'

import './styles.css'
import ConfirmationScreen from '../../components/ConfirmationScreen'

interface Item {
  id: number
  title: string
  image_url: string
}

interface StateResponse {
  sigla: string
}

interface CityResponse {
  nome: string
}

const CreatePoint = () => {
  const history = useHistory()

  const [showConfirmation, setShowConfirmation] = useState<boolean>()

  const [items, setItems] = useState<Item[]>([])
  const [stateInitials, setStateInitials] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  })

  const [initPos, setInitPos] = useState<[number, number]>([0, 0])
  const [selectedPos, setSelectedPos] = useState<[number, number]>([0, 0])

  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectedState, setSelectedState] = useState<string>('0')
  const [selectedCity, setSelectedCity] = useState<string>('0')
  const [selectedFile, setSelectedFile] = useState<File>()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords

      setInitPos([latitude, longitude])
    })
  }, [])

  useEffect(() => {
    api.get('items').then(({ data }) => setItems(data))
  }, [])

  useEffect(() => {
    axios
      .get<StateResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
      )
      .then(({ data }) => setStateInitials(data.map((state) => state.sigla)))
  }, [])

  useEffect(() => {
    if (selectedState === '0') return

    axios
      .get<CityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`
      )
      .then(({ data }) => setCities(data.map((city) => city.nome)))
  }, [selectedState])

  function handleSelectedState(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedState(event.target.value)
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value)
  }

  function handleMouseClick(event: LeafletMouseEvent) {
    setSelectedPos([event.latlng.lat, event.latlng.lng])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setFormData({ ...formData, [name]: value })
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id)

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id)

      setSelectedItems(filteredItems)
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const { name, email, whatsapp } = formData
    const state = selectedState
    const city = selectedCity
    const [latitude, longitude] = selectedPos
    const items = selectedItems

    const data = new FormData()

    data.append('name', name)
    data.append('email', email)
    data.append('whatsapp', whatsapp)
    data.append('state', state)
    data.append('city', city)
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))
    data.append('items', items.join(','))
    if (selectedFile) data.append('image', selectedFile)

    await api.post('points', data)

    setShowConfirmation(true)

    setTimeout(() => {
      setShowConfirmation(true)
      history.push('/')
    }, 2000)
  }

  return (
    <div id="page-create-point">
      <TheHeader />
      <form onSubmit={handleSubmit}>
        <h1>Cadastro do ponto de coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <section>
            <h2>Dados</h2>
          </section>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <section>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </section>

          <Map center={initPos} zoom={15} onClick={handleMouseClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPos} zoom={15} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="state">Estado (UF)</label>
              <select
                name="state"
                id="state"
                value={selectedState}
                onChange={handleSelectedState}
              >
                <option value="0">Selecione um estado</option>
                {stateInitials.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectedCity}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <section>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </section>

          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image_url} alt="lampada" />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
      {showConfirmation && <ConfirmationScreen />}
    </div>
  )
}

export default CreatePoint
