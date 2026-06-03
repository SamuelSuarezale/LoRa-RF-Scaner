import { useState, useEffect } from 'react'
import axios from 'axios'
import './Home.css'

function Home() {
  const [status, setStatus] = useState('Desconectado')
  const [lastPacket, setLastPacket] = useState(null)
  const [totalPackets, setTotalPackets] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://localhost:8000/status')
        .then(res => {
          setStatus(res.data.status)
          setLastPacket(res.data.last_packet)
          setTotalPackets(res.data.total_packets)
        })
        .catch(() => setStatus('Desconectado'))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="home">
      <div className="home-header">
        <h1>System Status</h1>
        <p>Monitor de estado del dispositivo Heltec LoRa V3</p>
      </div>

      <div className="status-cards">
        <div className={`card ${status === 'Conectado' ? 'card-green' : 'card-red'}`}>
          <h3>Estado del Dispositivo</h3>
          <p>{status}</p>
        </div>
        <div className="card">
          <h3>Total de Paquetes</h3>
          <p>{totalPackets}</p>
        </div>
        <div className="card">
          <h3>Último Paquete</h3>
          <p>{lastPacket ? `${lastPacket.rssi} dBm` : '---'}</p>
        </div>
      </div>
    </div>
  )
}

export default Home