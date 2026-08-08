import { useApp } from '../context/AppContext'
import { money } from '../data/mockData'

export default function Crew() {
  const { crewList, isAdmin, setCrewList, showToast } = useApp()

  function toggleAvailable(id) {
    if (!isAdmin) {
      showToast('Only admins can update crew availability')
      return
    }
    setCrewList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, available: !c.available } : c)),
    )
    showToast('Crew availability updated')
  }

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="eyebrow">Resources</div>
          <h1>Crew</h1>
          <p>Day rates roll into quotes; confirmation emails notify the assigned pilot.</p>
        </div>
      </header>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Day rate</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Availability</th>
                {isAdmin && <th />}
              </tr>
            </thead>
            <tbody>
              {crewList.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.role}</td>
                  <td className="mono">{money(c.dayRate)}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>
                    <span className={`badge ${c.available ? 'available' : 'unavailable'}`}>
                      {c.available ? 'available' : 'unavailable'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggleAvailable(c.id)}>
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
