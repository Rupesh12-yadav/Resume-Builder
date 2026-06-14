import React, { useState } from "react";
import { jsPDF } from "jspdf";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const C = {
  primary:   "#2563EB",
  secondary: "#3B82F6",
  bg:        "#F8FAFC",
  card:      "#FFFFFF",
  textPri:   "#0F172A",
  textSec:   "#64748B",
  success:   "#22C55E",
  border:    "#E2E8F0",
  priLight:  "#EFF6FF",
  priBorder: "#BFDBFE",
  priDark:   "#1D4ED8",
};

const SECTIONS = [
  { id: "Header",          icon: "👤", label: "Personal Info",    desc: "Name, contact & social links" },
  { id: "Summary",         icon: "📝", label: "Summary",          desc: "Career objective & overview"  },
  { id: "Skills",          icon: "⚡", label: "Technical Skills", desc: "Languages, tools & frameworks" },
  { id: "Education",       icon: "🎓", label: "Education",        desc: "Degrees & academic details"   },
  { id: "Projects",        icon: "🚀", label: "Projects",         desc: "Showcase your work"           },
  { id: "Certifications",  icon: "🏆", label: "Certifications",   desc: "Courses & certificates"       },
  { id: "Achievements",    icon: "🥇", label: "Achievements",     desc: "Awards, rankings & wins"      },
  { id: "Coding Profiles", icon: "💻", label: "Coding Profiles",  desc: "LeetCode, GFG, HackerRank"   },
  { id: "Coursework",      icon: "📚", label: "Coursework",       desc: "Relevant subjects studied"    },
  { id: "Languages",       icon: "🌐", label: "Languages",        desc: "Languages you speak"          },
];

const CODING_PLATFORMS = [
  { platform: "LeetCode",      icon: "LC", ph: "https://leetcode.com/u/yourname",              bg: "#FFA116", fg: "#fff" },
  { platform: "GeeksforGeeks", icon: "GG", ph: "https://geeksforgeeks.org/user/yourname",      bg: "#2F8D46", fg: "#fff" },
  { platform: "HackerRank",    icon: "HR", ph: "https://hackerrank.com/profile/yourname",      bg: "#00EA64", fg: "#1a1a1a" },
  { platform: "CodeChef",      icon: "CC", ph: "https://codechef.com/users/yourname",          bg: "#5B4638", fg: "#fff" },
  { platform: "Codeforces",    icon: "CF", ph: "https://codeforces.com/profile/yourname",      bg: "#1992D4", fg: "#fff" },
];

const SKILL_ICONS = [
  { emoji: "💬", bg: "#EFF6FF", color: "#2563EB" },
  { emoji: "🎨", bg: "#FFF7ED", color: "#EA580C" },
  { emoji: "⚙️", bg: "#F0FDF4", color: "#16A34A" },
  { emoji: "🗄️", bg: "#FAF5FF", color: "#9333EA" },
  { emoji: "🔧", bg: "#FEF2F2", color: "#DC2626" },
  { emoji: "☁️", bg: "#ECFEFF", color: "#0891B2" },
  { emoji: "📱", bg: "#FFF1F2", color: "#E11D48" },
  { emoji: "🧠", bg: "#FEFCE8", color: "#CA8A04" },
];

export default function PdfForm() {
  const [active, setActive]               = useState("Header");
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [header, setHeader]               = useState({ name:"", phone:"", email:"", location:"", linkedin:"", github:"", portfolio:"" });
  const [summary, setSummary]             = useState("");
  const [skills, setSkills] = useState([
    { label: "Programming Languages", value: "" },
    { label: "Frontend Development",  value: "" },
    { label: "Backend Development",   value: "" },
    { label: "Databases",             value: "" },
    { label: "Tools & Technologies",  value: "" },
  ]);
  const [education, setEducation]         = useState([{ degree:"", college:"", university:"", cgpa:"", year:"" }]);
  const [projects, setProjects]           = useState([{ name:"", description:"", tech:"", features:"", github:"", live:"" }]);
  const [certifications, setCerts]        = useState([{ name:"", issuer:"", year:"" }]);
  const [achievements, setAchievements]   = useState([""]);
  const [codingProfiles, setCodingProfiles] = useState([]);
  const [coursework, setCoursework]       = useState("");
  const [languages, setLanguages]         = useState("");

  /* helpers */
  const upd = (setter, list, idx, field, val) =>
    setter(list.map((item, i) => i === idx ? (typeof item === "string" ? val : { ...item, [field]: val }) : item));
  const add  = (setter, list, tpl) => setter([...list, tpl]);
  const rem  = (setter, list, idx) => setter(list.filter((_, i) => i !== idx));

  /* progress */
  const filled = [
    header.name, summary,
    skills.some(s => s.value.trim()),
    education[0]?.degree, projects[0]?.name,
    certifications[0]?.name, achievements[0],
    codingProfiles[0]?.url, coursework, languages,
  ].filter(Boolean).length;
  const pct = Math.round((filled / 10) * 100);
  const aIdx = SECTIONS.findIndex(s => s.id === active);

  /* ── PDF generation ── */
  const downloadPDF = () => {
    const doc = new jsPDF({ unit:"mm", format:"a4" });
    const W=210, M=18, UW=W-M*2; let y=20;
    const chk = (n=10) => { if(y+n>280){ doc.addPage(); y=20; } };
    const sec = (t) => {
      chk(12); doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(37,99,235);
      doc.text(t.toUpperCase(),M,y); doc.setDrawColor(37,99,235);
      doc.line(M,y+1.5,W-M,y+1.5); doc.setTextColor(0,0,0); y+=7;
    };
    /* header */
    doc.setFontSize(20); doc.setFont("helvetica","bold"); doc.setTextColor(15,23,42);
    doc.text(header.name||"Your Name",W/2,y,{align:"center"}); y+=8;
    doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(100,116,139);
    const ct=[header.phone,header.email,header.location].filter(Boolean);
    if(ct.length){ doc.text(ct.join("  |  "),W/2,y,{align:"center"}); y+=6; }
    const lks=[{label:"LinkedIn",url:header.linkedin},{label:"GitHub",url:header.github},{label:"Portfolio",url:header.portfolio}].filter(l=>l.url);
    if(lks.length){
      doc.setFontSize(9);
      const tt=lks.map(l=>l.label).join("   |   ");
      let cx=(W-doc.getTextWidth(tt))/2;
      lks.forEach((l,i)=>{ doc.setTextColor(37,99,235); doc.textWithLink(l.label,cx,y,{url:l.url}); cx+=doc.getTextWidth(l.label); if(i<lks.length-1){doc.setTextColor(100,100,100);doc.text("   |   ",cx,y);cx+=doc.getTextWidth("   |   ");} });
      doc.setTextColor(0,0,0); y+=8;
    }
    /* summary */
    if(summary.trim()){ sec("Professional Summary"); doc.setFontSize(9.5); doc.setFont("helvetica","normal"); doc.splitTextToSize(summary,UW).forEach(l=>{chk();doc.text(l,M,y);y+=5;}); y+=2; }
    /* skills */
    const sk=skills.filter(s=>s.value.trim());
    if(sk.length){
      sec("Technical Skills");
      sk.forEach(({label,value})=>{ chk(6); doc.setFontSize(9.5); doc.setFont("helvetica","bold"); doc.text(`${label}: `,M,y); const lw=doc.getTextWidth(`${label}: `); doc.setFont("helvetica","normal"); doc.text(value,M+lw,y); y+=5.5; }); y+=2;
    }
    /* education */
    const vE=education.filter(e=>e.degree||e.college);
    if(vE.length){ sec("Education"); vE.forEach(e=>{ chk(14); doc.setFontSize(10); doc.setFont("helvetica","bold"); doc.text(e.degree||"",M,y); doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.text(e.year||"",W-M,y,{align:"right"}); y+=5; doc.text(`${e.college||""}${e.university?" | "+e.university:""}`,M,y); if(e.cgpa) doc.text(`CGPA: ${e.cgpa}`,W-M,y,{align:"right"}); y+=7; }); }
    /* projects */
    const vP=projects.filter(p=>p.name);
    if(vP.length){ sec("Projects"); vP.forEach(p=>{ chk(20); doc.setFontSize(10); doc.setFont("helvetica","bold"); doc.text(p.name,M,y); y+=5; if(p.tech){doc.setFontSize(9);doc.setFont("helvetica","italic");doc.text(`Tech: ${p.tech}`,M,y);y+=5;} if(p.description){doc.setFont("helvetica","normal");doc.splitTextToSize(p.description,UW).forEach(l=>{chk();doc.text(l,M,y);y+=5;});} if(p.features){doc.splitTextToSize(`• ${p.features}`,UW).forEach(l=>{chk();doc.text(l,M,y);y+=5;});} [{label:"GitHub",url:p.github},{label:"Live Demo",url:p.live}].filter(l=>l.url).forEach(l=>{chk();doc.setFontSize(9);doc.setTextColor(37,99,235);doc.textWithLink(`${l.label}: ${l.url}`,M,y,{url:l.url});doc.setTextColor(0,0,0);y+=5;}); y+=2; }); }
    /* certs */
    const vC=certifications.filter(c=>c.name);
    if(vC.length){ sec("Certifications"); vC.forEach(c=>{chk(6);doc.setFontSize(9.5);doc.setFont("helvetica","normal");doc.text(`• ${c.name}${c.issuer?" — "+c.issuer:""}${c.year?" ("+c.year+")":""}`,M,y);y+=5.5;}); y+=2; }
    /* achievements */
    const vA=achievements.filter(a=>a.trim());
    if(vA.length){ sec("Achievements"); vA.forEach(a=>{chk(6);doc.setFontSize(9.5);doc.setFont("helvetica","normal");doc.splitTextToSize(`• ${a}`,UW).forEach(l=>{chk();doc.text(l,M,y);y+=5;});}); y+=2; }
    /* coding */
    const vCP=[...CODING_PLATFORMS.map(p=>{ const f=codingProfiles.find(c=>c.platform===p.platform); return f?.url?{platform:p.platform,url:f.url}:null; }).filter(Boolean), ...codingProfiles.filter(c=>!CODING_PLATFORMS.find(p=>p.platform===c.platform)&&c.platform&&c.url)];
    if(vCP.length){ sec("Coding Profiles"); vCP.forEach(c=>{chk(6);doc.setFontSize(9.5);doc.setFont("helvetica","bold");doc.text(`${c.platform}: `,M,y);const lw=doc.getTextWidth(`${c.platform}: `);doc.setFont("helvetica","normal");doc.setTextColor(37,99,235);doc.textWithLink(c.url,M+lw,y,{url:c.url});doc.setTextColor(0,0,0);y+=5.5;}); y+=2; }
    /* coursework */
    if(coursework.trim()){ sec("Relevant Coursework"); doc.setFontSize(9.5); doc.setFont("helvetica","normal"); doc.splitTextToSize(coursework,UW).forEach(l=>{chk();doc.text(l,M,y);y+=5;}); y+=2; }
    /* languages */
    if(languages.trim()){ sec("Languages Known"); doc.setFontSize(9.5); doc.setFont("helvetica","normal"); doc.text(languages,M,y); }
    doc.save(`${header.name||"resume"}_Resume.pdf`);
  };

  /* ── Shared styles ── */
  const inp = "resume-input";
  const ta  = "resume-textarea";

  return (
    <div className="app-shell">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}/>
      )}

      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}>
        {/* Logo + Progress */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="14,2 14,8 20,8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="10,9 9,9 8,9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="sidebar-logo-title">Resume Builder</p>
              <p className="sidebar-logo-sub">ATS-Friendly Pro</p>
            </div>
          </div>

          {/* Progress Card */}
          <div className="progress-card">
            <div className="progress-ring-wrap">
              <svg width="52" height="52" viewBox="0 0 36 36" style={{transform:"rotate(-90deg)"}}>
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
                <circle cx="18" cy="18" r="14" fill="none" stroke={C.success} strokeWidth="3"
                  strokeDasharray={`${pct * 0.88} 88`} strokeLinecap="round"/>
              </svg>
              <span className="progress-pct">{pct}%</span>
            </div>
            <div className="progress-info">
              <p className="progress-label">Profile Complete</p>
              <p className="progress-sub">{filled} of 10 sections filled</p>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{width:`${pct}%`}}/>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {SECTIONS.map((s, i) => {
            const isActive = active === s.id;
            const checks   = [header.name,summary,skills.some(s=>s.value.trim()),education[0]?.degree,projects[0]?.name,certifications[0]?.name,achievements[0],codingProfiles[0]?.url,coursework,languages];
            const isDone   = Boolean(checks[i]);
            return (
              <button key={s.id} onClick={()=>{ setActive(s.id); setSidebarOpen(false); }}
                className={`nav-item ${isActive?"nav-item--active":""} ${isDone&&!isActive?"nav-item--done":""}`}>
                <span className={`nav-icon ${isActive?"nav-icon--active":isDone?"nav-icon--done":""}`}>
                  {isDone && !isActive ? "✓" : s.icon}
                </span>
                <div className="nav-text">
                  <span className="nav-label">{s.label}</span>
                  <span className="nav-desc">{s.desc}</span>
                </div>
                {isActive && <span className="nav-dot"/>}
              </button>
            );
          })}
        </nav>

        {/* Download */}
        <div className="sidebar-footer">
          <button onClick={downloadPDF} className="btn-download">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download PDF Resume
          </button>
          <p className="sidebar-footer-note">
            <span className="dot-green"/> ATS optimized · Clickable links
          </p>
        </div>
      </aside>

      {/* ══════════════════════════════════
          MAIN
      ══════════════════════════════════ */}
      <main className="main-area">

        {/* ── Top Navbar ── */}
        <header className="topbar">
          <div className="topbar-inner">
            <div className="topbar-left">
              <button className="hamburger" onClick={()=>setSidebarOpen(o=>!o)} aria-label="Menu">
                <span/><span/><span/>
              </button>
              <div className="topbar-breadcrumb">
                <span className="topbar-breadcrumb-root">Resume Builder</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.border} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                <span className="topbar-breadcrumb-icon">{SECTIONS[aIdx]?.icon}</span>
                <span className="topbar-breadcrumb-page">{SECTIONS[aIdx]?.label}</span>
              </div>
            </div>
            <div className="topbar-right">
              <div className="step-dots">
                {SECTIONS.map((s,i)=>(
                  <button key={s.id} onClick={()=>setActive(s.id)} title={s.label}
                    className={`step-dot ${i===aIdx?"step-dot--active":i<aIdx?"step-dot--done":""}`}/>
                ))}
              </div>
              <div className="topbar-step-badge">Step {aIdx+1} / {SECTIONS.length}</div>
              <div className="topbar-saved"><span className="dot-green dot-pulse"/>Auto-saved</div>
            </div>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="main-body">

          {/* Hero Banner */}
          <div className="section-hero">
            <div className="section-hero-bg"/>
            <div className="section-hero-content">
              <div className="section-hero-icon">{SECTIONS[aIdx]?.icon}</div>
              <div>
                <p className="section-hero-step">Section {aIdx+1} of {SECTIONS.length}</p>
                <h1 className="section-hero-title">{SECTIONS[aIdx]?.label}</h1>
                <p className="section-hero-desc">{SECTIONS[aIdx]?.desc}</p>
              </div>
              <div className="section-hero-badge">
                <span className="section-hero-pct">{pct}%</span>
                <span className="section-hero-pct-label">Done</span>
              </div>
            </div>
          </div>

          {/* ── FORM CARD ── */}
          <div className="form-card">

            {/* ═══════ PERSONAL INFO ═══════ */}
            {active === "Header" && (
              <div className="section-body animate-in">

                {/* Name — BIG input */}
                <div className="field-group">
                  <label className="field-label">Full Name</label>
                  <input type="text" className="resume-input resume-input--hero"
                    placeholder="e.g. Rahul Kumar Sharma"
                    value={header.name} onChange={e=>setHeader({...header,name:e.target.value})}/>
                </div>

                {/* Contact 3-col */}
                <div className="grid-3">
                  <div className="field-group">
                    <label className="field-label">
                      <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.66-.66a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                      Mobile Number
                    </label>
                    <input type="tel" className={inp} placeholder="+91 98765 43210"
                      value={header.phone} onChange={e=>setHeader({...header,phone:e.target.value})}/>
                  </div>
                  <div className="field-group">
                    <label className="field-label">
                      <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      Email Address
                    </label>
                    <input type="email" className={inp} placeholder="you@example.com"
                      value={header.email} onChange={e=>setHeader({...header,email:e.target.value})}/>
                  </div>
                  <div className="field-group">
                    <label className="field-label">
                      <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      Location
                    </label>
                    <input type="text" className={inp} placeholder="City, State"
                      value={header.location} onChange={e=>setHeader({...header,location:e.target.value})}/>
                  </div>
                </div>

                {/* Divider */}
                <div className="section-divider">
                  <div className="divider-line"/>
                  <span className="divider-label">🔗 Social &amp; Portfolio Links</span>
                  <div className="divider-line"/>
                </div>

                {/* Social Links */}
                <div className="grid-3">
                  {[
                    {key:"linkedin", label:"LinkedIn",  placeholder:"linkedin.com/in/username", color:"#0A66C2", abbr:"in"},
                    {key:"github",   label:"GitHub",    placeholder:"github.com/username",       color:"#0F172A", abbr:"gh"},
                    {key:"portfolio",label:"Portfolio", placeholder:"yoursite.com",              color:C.primary, abbr:"🌐"},
                  ].map(({key,label,placeholder,color,abbr})=>(
                    <div key={key} className="field-group">
                      <label className="field-label">{label}</label>
                      <div className="input-with-prefix">
                        <span className="input-prefix" style={{background:color}}>{abbr}</span>
                        <input type="url" className={`${inp} input-has-prefix`}
                          placeholder={placeholder} value={header[key]}
                          onChange={e=>setHeader({...header,[key]:e.target.value})}/>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Links Preview */}
                {[header.linkedin,header.github,header.portfolio].some(Boolean) && (
                  <div className="links-preview">
                    <div className="links-preview-header">
                      <span className="links-preview-dot"/>
                      <span className="links-preview-title">Live Preview — Clickable in PDF</span>
                    </div>
                    <div className="links-preview-grid">
                      {[
                        {l:"LinkedIn",  u:header.linkedin,  color:"#0A66C2"},
                        {l:"GitHub",    u:header.github,    color:C.textPri},
                        {l:"Portfolio", u:header.portfolio, color:C.primary},
                      ].filter(x=>x.u).map(x=>(
                        <a key={x.l} href={x.u.startsWith("http")?x.u:`https://${x.u}`}
                          target="_blank" rel="noreferrer" className="link-chip">
                          <span className="link-chip-arrow" style={{color:x.color}}>↗</span>
                          <span className="link-chip-label">{x.l}</span>
                          <span className="link-chip-url">{x.u.replace(/https?:\/\//,"")}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ═══════ SUMMARY ═══════ */}
            {active === "Summary" && (
              <div className="section-body animate-in">
                <InfoBox>Write 3–5 lines about your career goals, key skills, and professional identity. Keep it under 400 characters for ATS compatibility.</InfoBox>
                <div className="field-group">
                  <label className="field-label">Professional Summary</label>
                  <textarea rows={7} className={ta}
                    placeholder="e.g. BCA Graduate and MERN Stack Developer with hands-on experience building scalable full-stack web applications. TCS NQT cleared with 1200+ score. Passionate about clean code, system design, and open-source contributions."
                    value={summary} onChange={e=>setSummary(e.target.value)}/>
                  <div className="char-counter">
                    <span>💡 Tip: Be concise and keyword-rich for ATS</span>
                    <span className={`char-badge ${summary.length>400?"char-badge--over":""}`}>{summary.length} / 400</span>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════ SKILLS ═══════ */}
            {active === "Skills" && (
              <div className="section-body animate-in">
                <InfoBox>Type comma-separated values. Tags appear live below each field — exactly as they'll look to recruiters.</InfoBox>
                {skills.map((s, i) => (
                  <div key={i} className="skill-block">
                    <div className="skill-row">
                      <div className="skill-row-content">
                        <div className="skill-block-header">
                            <input
                              type="text"
                              className="skill-label-input"
                              placeholder="Category name (e.g. DevOps)"
                              value={s.label}
                              onChange={e => setSkills(skills.map((sk, j) => j === i ? { ...sk, label: e.target.value } : sk))}
                            />
                            {skills.length > 1 && (
                              <button className="remove-btn" onClick={() => setSkills(skills.filter((_, j) => j !== i))}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            )}
                          </div>
                          <input type="text" className={inp} placeholder="e.g. React.js, Node.js, MongoDB"
                            value={s.value}
                            onChange={e => setSkills(skills.map((sk, j) => j === i ? { ...sk, value: e.target.value } : sk))}/>
                          {s.value && (
                            <div className="tags-row">
                              {s.value.split(",").map(t => t.trim()).filter(Boolean).map((tag, j) => (
                                <span key={j} className="tag">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                ))}
                <AddButton onClick={() => setSkills([...skills, { label: "", value: "" }])}>
                  + Add Skill Category
                </AddButton>
              </div>
            )}

            {/* ═══════ EDUCATION ═══════ */}
            {active === "Education" && (
              <div className="section-body animate-in">
                {education.map((e,i)=>(
                  <EntryCard key={i} index={i} total={education.length}
                    onRemove={()=>rem(setEducation,education,i)} title="Education Entry">
                    <div className="field-group">
                      <label className="field-label">Degree / Program</label>
                      <input type="text" className={inp} placeholder="e.g. BCA, B.Tech Computer Science"
                        value={e.degree} onChange={ev=>upd(setEducation,education,i,"degree",ev.target.value)}/>
                    </div>
                    <div className="grid-2">
                      <div className="field-group">
                        <label className="field-label">College Name</label>
                        <input type="text" className={inp} placeholder="e.g. DIT University"
                          value={e.college} onChange={ev=>upd(setEducation,education,i,"college",ev.target.value)}/>
                      </div>
                      <div className="field-group">
                        <label className="field-label">University Name</label>
                        <input type="text" className={inp} placeholder="e.g. Uttarakhand Technical Univ."
                          value={e.university} onChange={ev=>upd(setEducation,education,i,"university",ev.target.value)}/>
                      </div>
                      <div className="field-group">
                        <label className="field-label">CGPA / Percentage</label>
                        <input type="text" className={inp} placeholder="e.g. 8.5 CGPA / 85%"
                          value={e.cgpa} onChange={ev=>upd(setEducation,education,i,"cgpa",ev.target.value)}/>
                      </div>
                      <div className="field-group">
                        <label className="field-label">Passing Year</label>
                        <input type="text" className={inp} placeholder="e.g. 2024"
                          value={e.year} onChange={ev=>upd(setEducation,education,i,"year",ev.target.value)}/>
                      </div>
                    </div>
                  </EntryCard>
                ))}
                <AddButton onClick={()=>add(setEducation,education,{degree:"",college:"",university:"",cgpa:"",year:""})}>
                  + Add Another Education
                </AddButton>
              </div>
            )}

            {/* ═══════ PROJECTS ═══════ */}
            {active === "Projects" && (
              <div className="section-body animate-in">
                {projects.map((p,i)=>(
                  <EntryCard key={i} index={i} total={projects.length}
                    onRemove={()=>rem(setProjects,projects,i)} title="Project">
                    <div className="field-group">
                      <label className="field-label">Project Name</label>
                      <input type="text" className={inp} placeholder="e.g. E-Commerce Full Stack App"
                        value={p.name} onChange={e=>upd(setProjects,projects,i,"name",e.target.value)}/>
                    </div>
                    <div className="field-group">
                      <label className="field-label">Short Description</label>
                      <textarea rows={3} className={ta}
                        placeholder="What does this project do? What problem does it solve?"
                        value={p.description} onChange={e=>upd(setProjects,projects,i,"description",e.target.value)}/>
                    </div>
                    <div className="field-group">
                      <label className="field-label">Technologies Used</label>
                      <input type="text" className={inp} placeholder="React.js, Node.js, MongoDB, Express.js"
                        value={p.tech} onChange={e=>upd(setProjects,projects,i,"tech",e.target.value)}/>
                      {p.tech && (
                        <div className="tags-row">
                          {p.tech.split(",").map(t=>t.trim()).filter(Boolean).map((tag,j)=>(
                            <span key={j} className="tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="field-group">
                      <label className="field-label">Key Features</label>
                      <textarea rows={2} className={ta}
                        placeholder="e.g. JWT Auth, Real-time chat, Razorpay payment gateway, Admin dashboard"
                        value={p.features} onChange={e=>upd(setProjects,projects,i,"features",e.target.value)}/>
                    </div>
                    <div className="grid-2">
                      <div className="field-group">
                        <label className="field-label">
                          <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                          GitHub Link
                        </label>
                        <input type="url" className={inp} placeholder="https://github.com/..."
                          value={p.github} onChange={e=>upd(setProjects,projects,i,"github",e.target.value)}/>
                      </div>
                      <div className="field-group">
                        <label className="field-label">
                          <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                          Live Demo URL
                        </label>
                        <input type="url" className={inp} placeholder="https://yourapp.vercel.app"
                          value={p.live} onChange={e=>upd(setProjects,projects,i,"live",e.target.value)}/>
                      </div>
                    </div>
                    {(p.github||p.live) && (
                      <div className="project-link-preview">
                        {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="project-link project-link--github">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                          GitHub ↗
                        </a>}
                        {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="project-link project-link--live">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                          Live Demo ↗
                        </a>}
                      </div>
                    )}
                  </EntryCard>
                ))}
                <AddButton onClick={()=>add(setProjects,projects,{name:"",description:"",tech:"",features:"",github:"",live:""})}>
                  + Add Another Project
                </AddButton>
              </div>
            )}

            {/* ═══════ CERTIFICATIONS ═══════ */}
            {active === "Certifications" && (
              <div className="section-body animate-in">
                {certifications.map((c,i)=>(
                  <EntryCard key={i} index={i} total={certifications.length}
                    onRemove={()=>rem(setCerts,certifications,i)} title="Certification">
                    <div className="field-group">
                      <label className="field-label">Certification Name</label>
                      <input type="text" className={inp} placeholder="e.g. NPTEL Python Programming, Google Data Analytics"
                        value={c.name} onChange={e=>upd(setCerts,certifications,i,"name",e.target.value)}/>
                    </div>
                    <div className="grid-2">
                      <div className="field-group">
                        <label className="field-label">Issuing Organization</label>
                        <input type="text" className={inp} placeholder="e.g. Coursera, NPTEL, Google, Udemy"
                          value={c.issuer} onChange={e=>upd(setCerts,certifications,i,"issuer",e.target.value)}/>
                      </div>
                      <div className="field-group">
                        <label className="field-label">Year Completed</label>
                        <input type="text" className={inp} placeholder="2024"
                          value={c.year} onChange={e=>upd(setCerts,certifications,i,"year",e.target.value)}/>
                      </div>
                    </div>
                  </EntryCard>
                ))}
                <AddButton onClick={()=>add(setCerts,certifications,{name:"",issuer:"",year:""})}>
                  + Add Another Certification
                </AddButton>
              </div>
            )}

            {/* ═══════ ACHIEVEMENTS ═══════ */}
            {active === "Achievements" && (
              <div className="section-body animate-in">
                <InfoBox>Add one achievement per entry. Include contest rankings, hackathon wins, scholarships, and awards.</InfoBox>
                <div className="achievements-list">
                  {achievements.map((a,i)=>(
                    <div key={i} className="achievement-row group">
                      <div className="achievement-num">{i+1}</div>
                      <input type="text" className={`${inp} flex-1`}
                        placeholder="e.g. TCS NQT Cleared with 1200+ score | LeetCode 500+ problems solved"
                        value={a} onChange={e=>upd(setAchievements,achievements,i,null,e.target.value)}/>
                      {achievements.length>1 && (
                        <button onClick={()=>rem(setAchievements,achievements,i)} className="remove-btn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <AddButton onClick={()=>add(setAchievements,achievements,"")}>+ Add Achievement</AddButton>
              </div>
            )}

            {/* ═══════ CODING PROFILES ═══════ */}
            {active === "Coding Profiles" && (
              <div className="section-body animate-in">
                <InfoBox>These appear as clickable hyperlinks in your PDF. Paste your profile URL below each platform.</InfoBox>
                <div className="coding-grid">
                  {CODING_PLATFORMS.map(({platform,icon,ph,bg,fg})=>{
                    const existing   = codingProfiles.find(c=>c.platform===platform);
                    const profileIdx = codingProfiles.findIndex(c=>c.platform===platform);
                    const filled     = Boolean(existing?.url);
                    return (
                      <div key={platform} className={`coding-card ${filled?"coding-card--filled":""}`}>
                        <div className="coding-card-header">
                          <div className="coding-icon" style={{background:bg,color:fg}}>{icon}</div>
                          <span className="coding-platform">{platform}</span>
                          {filled && <span className="coding-badge">✓ Added</span>}
                        </div>
                        <input type="url" className={inp} placeholder={ph}
                          value={existing?.url||""}
                          onChange={e=>{
                            if(profileIdx>=0) upd(setCodingProfiles,codingProfiles,profileIdx,"url",e.target.value);
                            else add(setCodingProfiles,codingProfiles,{platform,url:e.target.value});
                          }}/>
                        {filled && (
                          <a href={existing.url} target="_blank" rel="noreferrer" className="coding-open-link">
                            ↗ Open Profile
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Custom platforms */}
                {codingProfiles.filter(c=>!CODING_PLATFORMS.find(p=>p.platform===c.platform)).length>0 && (
                  <div className="field-group mt-4">
                    <label className="field-label">Other Platforms</label>
                    {codingProfiles.filter(c=>!CODING_PLATFORMS.find(p=>p.platform===c.platform)).map((c,i)=>{
                      const ri=codingProfiles.indexOf(c);
                      return (
                        <div key={i} className="achievement-row">
                          <input type="text" className="resume-input w-32 shrink-0" placeholder="Platform"
                            value={c.platform} onChange={e=>upd(setCodingProfiles,codingProfiles,ri,"platform",e.target.value)}/>
                          <input type="url" className={`${inp} flex-1`} placeholder="https://..."
                            value={c.url} onChange={e=>upd(setCodingProfiles,codingProfiles,ri,"url",e.target.value)}/>
                          <button onClick={()=>rem(setCodingProfiles,codingProfiles,ri)} className="remove-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <AddButton onClick={()=>add(setCodingProfiles,codingProfiles,{platform:"",url:""})}>+ Add Other Platform</AddButton>
              </div>
            )}

            {/* ═══════ COURSEWORK ═══════ */}
            {active === "Coursework" && (
              <div className="section-body animate-in">
                <InfoBox>Add relevant subjects separated by commas. This helps ATS systems match your academic profile to job requirements.</InfoBox>
                <div className="field-group">
                  <label className="field-label">Relevant Subjects</label>
                  <textarea rows={5} className={ta}
                    placeholder="Data Structures & Algorithms, DBMS, Operating System, Computer Networks, System Design, OOP, Software Engineering, Web Technologies"
                    value={coursework} onChange={e=>setCoursework(e.target.value)}/>
                </div>
                {coursework && (
                  <div className="tags-row">
                    {coursework.split(",").map(s=>s.trim()).filter(Boolean).map((tag,i)=>(
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══════ LANGUAGES ═══════ */}
            {active === "Languages" && (
              <div className="section-body animate-in">
                <InfoBox>Add languages you speak or write — comma separated. Include proficiency level for clarity.</InfoBox>
                <div className="field-group">
                  <label className="field-label">Languages Known</label>
                  <input type="text" className={inp}
                    placeholder="e.g. Hindi (Native), English (Fluent), Sanskrit (Basic)"
                    value={languages} onChange={e=>setLanguages(e.target.value)}/>
                </div>
                {languages && (
                  <div className="tags-row">
                    {languages.split(",").map(s=>s.trim()).filter(Boolean).map((tag,i)=>(
                      <span key={i} className="tag tag--lang">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Footer Nav ── */}
            <div className="form-footer">
              <button className="btn-ghost"
                onClick={()=>{if(aIdx>0)setActive(SECTIONS[aIdx-1].id);}}
                disabled={aIdx===0}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                Previous
              </button>
              <button className="btn-primary-outline" onClick={downloadPDF}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download PDF
              </button>
              <button className="btn-primary"
                onClick={()=>{if(aIdx<SECTIONS.length-1)setActive(SECTIONS[aIdx+1].id);}}
                disabled={aIdx===SECTIONS.length-1}>
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
function InfoBox({children}){
  return (
    <div className="info-box">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" style={{shrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>{children}</p>
    </div>
  );
}

function EntryCard({children,index,total,onRemove,title}){
  return (
    <div className="entry-card">
      <div className="entry-card-header">
        <div className="entry-card-badge">{index+1}</div>
        <span className="entry-card-title">{title} {index+1}</span>
        {total>1 && (
          <button onClick={onRemove} className="entry-remove-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Remove
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function AddButton({children,onClick}){
  return (
    <button onClick={onClick} className="add-btn">
      {children}
    </button>
  );
}
