import { useApp } from '../context/AppContext'
import { money } from '../data/mockData'

export default function Fleet() {
  const { fleet, isAdmin, setFleet, showToast } = useApp()

  function toggleStatus(id) {
    if (!isAdmin) {
      showToast('Only admins can change aircraft status')
      return
    }
    setFleet((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'available' ? 'maintenance' : 'available' }
          : a,
      ),
    )
    showToast('Aircraft status updated')
  }

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="eyebrow">Resources</div>
          <h1>Fleet</h1>
          <p>Hourly rates, fuel burn, and cruise speed drive the quote engine.</p>
        </div>
      </header>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tail</th>
                <th>Type</th>
                <th>Seats</th>
                <th>Hourly</th>
                <th>Burn</th>
                <th>Cruise</th>
                <th>Status</th>
                {isAdmin && <th />}
              </tr>
            </thead>
            <tbody>
              {fleet.map((a) => (
                <tr key={a.id}>
                  <td className="mono"><strong>{a.tail}</strong></td>
                  <td>{a.type}</td>
                  <td>{a.seats}</td>
                  <td className="mono">{money(a.hourlyRate)}/hr</td>
                  <td>{a.fuelBurnGph} gph</td>
                  <td>{a.cruiseKt} kt</td>
                  <td><span className={`badge ${a.status}`}>{a.status}</span></td>
                  {isAdmin && (
                    <td>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggleStatus(a.id)}>
                        Toggle
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
