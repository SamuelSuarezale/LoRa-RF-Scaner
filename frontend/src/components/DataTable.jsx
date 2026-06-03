import './DataTable.css';

function DataTable({ wifiData, loraData }) {
  return (
    <div className="data-table">
      <h2>📶 Redes WiFi Detectadas</h2>
      <table>
        <thead>
          <tr>
            <th>SSID</th>
            <th>RSSI (dBm)</th>
            <th>MAC</th>
            <th>Canal</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {wifiData.map(packet => (
            <tr key={packet.id}>
              <td>{packet.ssid}</td>
              <td>{packet.rssi}</td>
              <td>{packet.mac}</td>
              <td>{packet.channel}</td>
              <td>{new Date(packet.timestamp).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>🛰️ Paquetes LoRa Detectados</h2>
      <table>
        <thead>
          <tr>
            <th>RSSI (dBm)</th>
            <th>SNR</th>
            <th>Frecuencia</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {loraData.length === 0 ? (
            <tr><td colSpan="4">Sin señales LoRa detectadas</td></tr>
          ) : (
            loraData.map(packet => (
              <tr key={packet.id}>
                <td>{packet.rssi}</td>
                <td>{packet.snr}</td>
                <td>{packet.frequency} MHz</td>
                <td>{new Date(packet.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable