import {useState, useEffect} from 'react';
import axios from 'axios';
import './Models.css';

function Models() {
  const [measurements, setMeasurements] = useState([])
  const [selectedModel, setSelectedModel] = useState('logdistance')

  useEffect(() => {
    axios.get('http://localhost:8000/measurements')
      .then(res => setMeasurements(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="models">
      <h1>📈 Modelos de Propagación</h1>

      <div className="model-selector">
        <button
          className={selectedModel === 'logdistance' ? 'active' : ''}
          onClick={() => setSelectedModel('logdistance')}
        >
          Log-Distance
        </button>
        <button
          className={selectedModel === 'friis' ? 'active' : ''}
          onClick={() => setSelectedModel('friis')}
        >
          Friis
        </button>
        <button
          className={selectedModel === 'okumura' ? 'active' : ''}
          onClick={() => setSelectedModel('okumura')}
        >
          Okumura-Hata
        </button>
        <button
          className={selectedModel === 'cost231' ? 'active' : ''}
          onClick={() => setSelectedModel('cost231')}
        >
          COST-231
        </button>
      </div>

      <div className="model-info">
        <p>Modelo seleccionado: <span>{selectedModel}</span></p>
        <p>Mediciones disponibles: <span>{measurements.length}</span></p>
      </div>
    </div>
  )
}

export default Models