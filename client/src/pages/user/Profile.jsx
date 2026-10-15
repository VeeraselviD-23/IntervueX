import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import { getProfile } from "../../services/userService";

function Profile() {
  const [profile, setProfile] = useState(null);
  useEffect(() => { getProfile().then(({ data }) => setProfile(data.user || data)).catch(() => setProfile(null)); }, []);
  const initials = profile?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2) || "U";
  return (
    <div className="page">
      <BackButton variant="page" />

      <section className="page-heading">
        <div className="container">
          <h1>My Profile</h1>
          <p>IntervueX career platform</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

<div className="profile-grid">
  <div className="card">
    <div className="avatar">{initials}</div>
    <h2>{profile?.name || "Loading profile..."}</h2>
    <p>{profile?.bio || "Add a professional summary to your profile."}</p>
    <p>{profile?.location || "Location not added"}</p>
    <a className="button button-primary" href="/user/profile/edit">Edit Profile</a>
  </div>
  <div className="card">
    <h3>Professional Summary</h3>
    <p>{profile?.bio || "No professional summary added yet."}</p>
    <h3>Skills</h3>
    <ul className="list">{(profile?.skills || []).map((skill) => <li key={skill}>{skill}</li>)}{!profile?.skills?.length && <li>No skills added yet.</li>}</ul>
    <h3>Education</h3>
    <p>{profile?.education || "Education not added yet."}</p>
  </div>
</div>

        </div>
      </main>

    </div>
  );
}
export default Profile;
