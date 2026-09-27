import { useEffect, useMemo, useState } from "react"
import "./App.css"

const API = "http://localhost:5000/api/applications"

const emptyForm = {
  company_name: "",
  job_role: "",
  location: "",
  salary: "",
  status: "Applied",
  applied_date: new Date().toISOString().slice(0, 10),
  job_url: "",
  notes: ""
}

function App() {
  const [applications, setApplications] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch(API)

      if (!response.ok) {
        throw new Error()
      }

      const data = await response.json()
      setApplications(data)
      setError("")
    } catch {
      setError("Could not connect to the backend.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])

  const stats = useMemo(() => ({
    total: applications.length,
    applied: applications.filter(a => a.status === "Applied").length,
    interview: applications.filter(a => a.status === "Interview").length,
    selected: applications.filter(a => a.status === "Selected").length,
    rejected: applications.filter(a => a.status === "Rejected").length
  }), [applications])

  const filteredApplications = applications.filter(app => {
    const term = search.toLowerCase()

    const matchesSearch =
      app.company_name.toLowerCase().includes(term) ||
      app.job_role.toLowerCase().includes(term) ||
      app.location.toLowerCase().includes(term)

    const matchesStatus =
      statusFilter === "All" || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const url = editingId
      ? `${API}/${editingId}`
      : API

    const method = editingId ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          salary: form.salary || "0"
        })
      })

      if (!response.ok) {
        throw new Error()
      }

      await loadApplications()
      resetForm()

    } catch {
      setError("Unable to save application.")
    }
  }

  const editApplication = app => {
    setForm({
      company_name: app.company_name,
      job_role: app.job_role,
      location: app.location,
      salary: app.salary,
      status: app.status,
      applied_date: app.applied_date,
      job_url: app.job_url || "",
      notes: app.notes || ""
    })

    setEditingId(app.id)
    setShowForm(true)
  }

  const deleteApplication = async id => {
    if (!window.confirm("Delete this application?")) return

    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE"
      })

      loadApplications()

    } catch {
      setError("Unable to delete application.")
    }
  }

  return (
    <div className="app">

      <header className="topbar">
        <div>
          <h2>CareerTrack</h2>
          <p>Job Application Tracker</p>
        </div>

        <button
          className="primary"
          onClick={() => setShowForm(true)}
        >
          + Add Application
        </button>
      </header>

      <main className="container">

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <section className="hero">
          <h1>Keep your job search organized.</h1>
          <p>
            Track applications, interviews and outcomes in one place.
          </p>
        </section>

        <section className="stats">

          <Stat title="Total" value={stats.total} />
          <Stat title="Applied" value={stats.applied} />
          <Stat title="Interviews" value={stats.interview} />
          <Stat title="Selected" value={stats.selected} />
          <Stat title="Rejected" value={stats.rejected} />

        </section>

        {showForm && (
          <section className="panel">

            <div className="form-header">
              <h2>
                {editingId
                  ? "Edit Application"
                  : "Add Application"}
              </h2>

              <button
                className="close"
                onClick={resetForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <Field
                  label="Company Name"
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Job Role"
                  name="job_role"
                  value={form.job_role}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Salary"
                  name="salary"
                  type="number"
                  value={form.salary}
                  onChange={handleChange}
                />

                <div className="field">
                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Selected</option>
                    <option>Rejected</option>
                  </select>
                </div>

                <Field
                  label="Applied Date"
                  name="applied_date"
                  type="date"
                  value={form.applied_date}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Job URL"
                  name="job_url"
                  type="url"
                  value={form.job_url}
                  onChange={handleChange}
                />

                <div className="field full">
                  <label>Notes</label>

                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button className="primary">
                  {editingId
                    ? "Update Application"
                    : "Save Application"}
                </button>

              </div>

            </form>

          </section>
        )}

        <section className="panel">

          <div className="toolbar">

            <div>
              <h2>Applications</h2>

              <p>
                {filteredApplications.length} application(s)
              </p>
            </div>

            <div className="filters">

              <input
                placeholder="Search company, role or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option>All</option>
                <option>Applied</option>
                <option>Interview</option>
                <option>Selected</option>
                <option>Rejected</option>
              </select>

            </div>

          </div>

          {loading ? (
            <div className="empty">
              Loading applications...
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="empty">
              <h3>No applications found</h3>
              <p>Add your first job application.</p>
            </div>
          ) : (

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th>Salary</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredApplications.map(app => (

                    <tr key={app.id}>

                      <td>
                        <strong>{app.company_name}</strong>

                        {app.job_url && (
                          <a
                            href={app.job_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open job
                          </a>
                        )}
                      </td>

                      <td>{app.job_role}</td>

                      <td>{app.location}</td>

                      <td>
                        <span className={`status ${app.status}`}>
                          {app.status}
                        </span>
                      </td>

                      <td>{app.applied_date}</td>

                      <td>
                        ₹{Number(app.salary || 0).toLocaleString("en-IN")}
                      </td>

                      <td>

                        <button
                          className="edit"
                          onClick={() => editApplication(app)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete"
                          onClick={() => deleteApplication(app.id)}
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  )
}

function Stat({ title, value }) {
  return (
    <div className="stat">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  )
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required
}) {
  return (
    <div className="field">

      <label>{label}</label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />

    </div>
  )
}

export default App