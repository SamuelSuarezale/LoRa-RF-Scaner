import { useState, useEffect } from 'react'
import axios from 'axios'
import RSSIChart from '../components/RSSIChart'
import DataTable from '../components/DataTable'
import './Measurements.css'

function Measurements() {
  const [wifiData, setWifiData] = useState([])
  const [loraData, setLoraData] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://localhost:8000/wifi')
        .then(res => setWifiData(res.data))
        .catch(err => console.error(err))

      axios.get('http://localhost:8000/lora')
        .then(res => setLoraData(res.data))
        .catch(err => console.error(err))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="measurements">
      <div className="measurements-header">
        <h1>RF Scanner</h1>
        <span className="scanning-status">● ESCANEANDO EN VIVO</span>
      </div>
      <RSSIChart wifiData={wifiData} loraData={loraData} />
      <DataTable wifiData={wifiData} loraData={loraData} />
    </div>
  )
}

export default Measurements