import { useApp } from '../context/AppContext'
import { money } from '../data/mockData'

export default function Airports() {
  const { airportsList } = useApp()

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="eyebrow">Resources</div>
          <h1>Airports</h1>
          <p>Lat/long powers great-circle distance; fees feed the cost breakdown.</p>
        </div>
      </header>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ICAO</th>
                <th>Name</th>
                <th>City</th>
                <th>Lat</th>
                <th>Lon</th>
                <th>Landing</th>
                <th>Handling</th>
              </tr>
            </thead>
            <tbody>
              {airportsList.map((a) => (
                <tr key={a.id}>
                  <td className="mono"><strong>{a.icao}</strong></td>
                  <td>{a.name}</td>
                  <td>{a.city}</td>
                  <td className="mono">{a.lat.toFixed(4)}</td>
                  <td className="mono">{a.lon.toFixed(4)}</td>
                  <td className="mono">{money(a.landingFee)}</td>
                  <td className="mono">{money(a.handlingFee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
