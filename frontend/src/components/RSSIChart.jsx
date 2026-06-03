import './DataTable.css';
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import './RSSIChart.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function RSSIChart({ wifiData }) {
  const labels = wifiData.slice(0, 15).map(d => d.ssid)
  const values = wifiData.slice(0, 15).map(d => d.rssi)
  const colors = values.map(v => v > -70 ? '#00ff88' : v > -85 ? '#ffaa00' : '#ff4444')

  const data = {
    labels,
    datasets: [{
      label: 'RSSI (dBm)',
      data: values,
      backgroundColor: colors,
      borderRadius: 6,
    }]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: 'white' } },
      title: {
        display: true,
        text: '📶 Intensidad de Señal WiFi',
        color: '#00ff88',
        font: { size: 16 }
      }
    },
    scales: {
      x: { ticks: { color: 'white' }, grid: { color: '#333' } },
      y: {
        ticks: { color: 'white' },
        grid: { color: '#333' },
        min: -100,
        max: 0
      }
    }
  }

  return (
    <div className="rssi-chart">
      <Bar data={data} options={options} />
    </div>
  )
}

export default RSSIChart