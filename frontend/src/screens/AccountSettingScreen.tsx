import React, { useState } from "react"

export const AccountSettingsScreen: React.FC = () => {

  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="account-page padX6 padY6 flex gap6">

      {/* LEFT NAVIGATION */}
      <div className="account-nav flexC gap2">
        <NavItem label="Profile" active={activeTab==="profile"} onClick={()=>setActiveTab("profile")} />
        <NavItem label="Security" active={activeTab==="security"} onClick={()=>setActiveTab("security")} />
        <NavItem label="Interview Preferences" active={activeTab==="preferences"} onClick={()=>setActiveTab("preferences")} />
        <NavItem label="Notifications" active={activeTab==="notifications"} onClick={()=>setActiveTab("notifications")} />
        <NavItem label="Danger Zone" active={activeTab==="danger"} onClick={()=>setActiveTab("danger")} />
      </div>

      {/* RIGHT CONTENT */}
      <div className="account-content card pad5 flexC gap5">

        {activeTab==="profile" && <ProfileSection />}
        {activeTab==="security" && <SecuritySection />}
        {activeTab==="preferences" && <PreferencesSection />}
        {activeTab==="notifications" && <NotificationsSection />}
        {activeTab==="danger" && <DangerSection />}

      </div>

    </div>
  )
}

const NavItem = ({label,active,onClick}:{label:string,active:boolean,onClick:()=>void}) => (
  <div 
    className={`nav-item ${active ? "active" : ""}`}
    onClick={onClick}
  >
    {label}
  </div>
)

const ProfileSection = () => (
  <>
    <h2 className="fL">Profile</h2>

    <div className="form-group">
      <label>Full Name</label>
      <input className="input" placeholder="Abhay Bhadauriya"/>
    </div>

    <div className="form-group">
      <label>Email</label>
      <input className="input" disabled placeholder="email@example.com"/>
    </div>

    <div className="form-group">
      <label>Target Role</label>
      <select className="input">
        <option>Frontend</option>
        <option>Backend</option>
        <option>Fullstack</option>
      </select>
    </div>
  </>
)

const SecuritySection = () => (
  <>
    <h2 className="fL">Security</h2>

    <button className="btn-outline">Change Password</button>
    <button className="btn-outline">Enable 2FA</button>
    <button className="btn-ghost">Logout From All Devices</button>
  </>
)

const PreferencesSection = () => (
  <>
    <h2 className="fL">Interview Preferences</h2>

    <div className="form-group">
      <label>Default Difficulty</label>
      <select className="input">
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
    </div>

    <div className="toggle-row">
      <span>Enable Intro Questions</span>
      <input type="checkbox"/>
    </div>

    <div className="toggle-row">
      <span>Adaptive Followups</span>
      <input type="checkbox"/>
    </div>
  </>
)

const NotificationsSection = () => (
  <>
    <h2 className="fL">Notifications</h2>

    <div className="toggle-row">
      <span>Email Reports</span>
      <input type="checkbox"/>
    </div>

    <div className="toggle-row">
      <span>Weekly Performance Summary</span>
      <input type="checkbox"/>
    </div>
  </>
)
const DangerSection = () => (
  <>
    <h2 className="fL textDanger">Danger Zone</h2>

    <div className="danger-box pad4">
      <p>This action cannot be undone.</p>
      <button className="btn-danger">Delete Account</button>
    </div>
  </>
)

