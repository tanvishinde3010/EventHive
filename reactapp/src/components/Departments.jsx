const departments = [
  { name: 'Computer Engineering', icon: '💻' },
  { name: 'Information Technology', icon: '🌐' },
  { name: 'AI & Data Science', icon: '🤖' },
  { name: 'Civil Engineering', icon: '🏗️' },
  { name: 'Mechanical Engineering', icon: '⚙️' },
  { name: 'Electronics & Telecommunication', icon: '📡' },
]

function Departments() {
  return (
    <section id="departments" className="section departments-section">
      <div className="section-heading">
        <p className="eyebrow">FIND YOUR COMMUNITY</p>
        <h2>Explore by Department</h2>
        <p>
          Discover opportunities and activities across your college.
        </p>
      </div>

      <div className="department-container">
        {departments.map((department) => (
          <article className="department-card" key={department.name}>
            <span className="department-icon" aria-hidden="true">
              {department.icon}
            </span>

            <h3>{department.name}</h3>

            <p>Explore department events and activities.</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Departments
