import React, { useState, useEffect } from 'react'
import {
  getAllSkills,
  getUserSkills,
  addUserSkill,
  removeUserSkill,
  markSkillAsPracticed
} from '../services/api'

import './SkillsPage.css'
import skillsIcon from '../assets/skills.svg'
import leaveIcon from '../assets/leave.svg'
import { SKILL_CATEGORY_STYLES, SKILL_ICONS } from '../data/skillStyles'

/* ===============================
   CATEGORY BADGE
================================= */
function SkillCategoryBadge({ category }) {
  const config = SKILL_CATEGORY_STYLES[category]

  if (!config) {
    return <span className="category-badge">{category}</span>
  }

  return (
    <div
      className="category-badge"
      style={{
        background: config.color,
        color: config.textColor
      }}
    >
      {config.icon && (
        <img
          src={SKILL_ICONS[config.icon]}
          alt=""
          className="category-icon"
        />
      )}
      {config.label}
    </div>
  )
}

/* ===============================
   MAIN COMPONENT
================================= */
export default function SkillsPage() {
  const [allSkills, setAllSkills] = useState([])
  const [userSkills, setUserSkills] = useState([])
  const [activeTab, setActiveTab] = useState('my-skills')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = async () => {
    try {
      const [allSkillsRes, userSkillsRes] = await Promise.all([
        getAllSkills(),
        getUserSkills()
      ])

      setAllSkills(allSkillsRes.data || [])
      setUserSkills(userSkillsRes.data || [])
    } catch (error) {
      console.error('Failed to load skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = async (skillId) => {
    try {
      await addUserSkill(skillId)
      loadSkills()
    } catch (error) {
      console.error('Add skill failed:', error)
    }
  }

  const handleRemoveSkill = async (skillId) => {
    try {
      await removeUserSkill(skillId)
      loadSkills()
    } catch (error) {
      console.error('Remove skill failed:', error)
    }
  }

  const handlePractice = async (skillId) => {
    try {
      await markSkillAsPracticed(skillId)
      loadSkills()
    } catch (error) {
      console.error('Practice failed:', error)
    }
  }

  /* ===============================
     FILTER LOGIC
  ================================= */
  const getAvailableSkills = () => {
    const userSkillIds = userSkills.map((s) => s.id)
    return allSkills.filter((s) => !userSkillIds.includes(s.id))
  }

  const matchesFilter = (skill) =>
    skill.name.toLowerCase().includes(filter.toLowerCase()) ||
    skill.description.toLowerCase().includes(filter.toLowerCase())

  const filteredUserSkills = userSkills.filter(matchesFilter)
  const filteredAvailableSkills = getAvailableSkills().filter(matchesFilter)

  /* ===============================
     LOADING
  ================================= */
  if (loading) {
    return (
      <div className="skills-page">
        <p>Loading...</p>
      </div>
    )
  }

  /* ===============================
     UI
  ================================= */
  return (
    <div className="skills-page">
      
      {/* HEADER */}
      <div className="skills-header">
        <h1 className="skills-title">
          <img src={skillsIcon} alt="Skills" className="skills-title-icon" />
          Coping Skills
        </h1>
        <p>Learn and practice skills to manage your emotions</p>
      </div>

      {/* SEARCH */}
      <div className="skills-search">
        <input
          type="text"
          placeholder="Search skills..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* TABS */}
      <div className="skills-tabs">
        <button
          className={`tab ${activeTab === 'my-skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-skills')}
        >
          My Skills ({userSkills.length})
        </button>

        <button
          className={`tab ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          Discover ({getAvailableSkills().length})
        </button>
      </div>

      {/* ===============================
          MY SKILLS
      ================================= */}
      {activeTab === 'my-skills' && (
        <div className="skills-grid">
          {filteredUserSkills.length === 0 ? (
            <div className="no-skills no-skills-with-icon">
              <img src={leaveIcon} alt="Empty" className="no-skills-icon" />
              <p>No skills yet. Discover some!</p>
            </div>
          ) : (
            filteredUserSkills.map((skill) => (
              <div key={skill.id} className="skill-card my-skill">
                
                <div className="skill-header">
                  <h3>{skill.name}</h3>
                  <SkillCategoryBadge category={skill.category} />
                </div>

                <p className="skill-description">{skill.description}</p>

                <div className="skill-stats">
                  <div className="stat">
                    <p className="stat-label">Times Practiced</p>
                    <p className="stat-value">{skill.practiced_count || 0}</p>
                  </div>

                  {skill.last_practiced && (
                    <div className="stat">
                      <p className="stat-label">Last Practiced</p>
                      <p className="stat-value">
                        {new Date(skill.last_practiced).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="skill-instructions">
                  <strong>How to:</strong>
                  <p>{skill.instructions}</p>
                </div>

                <div className="skill-actions">
                  <button
                    className="practice-btn"
                    onClick={() => handlePractice(skill.id)}
                  >
                    Practiced Today
                  </button>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveSkill(skill.id)}
                  >
                    Remove
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* ===============================
          DISCOVER
      ================================= */}
      {activeTab === 'discover' && (
        <div className="skills-grid">
          {filteredAvailableSkills.length === 0 ? (
            <div className="no-skills no-skills-with-icon">
              <img src={leaveIcon} alt="Empty" className="no-skills-icon" />
              <p>No more skills to discover!</p>
            </div>
          ) : (
            filteredAvailableSkills.map((skill) => (
              <div key={skill.id} className="skill-card">

                <div className="skill-header">
                  <h3>{skill.name}</h3>
                  <SkillCategoryBadge category={skill.category} />
                </div>

                <p className="skill-description">{skill.description}</p>

                <div className="skill-moods">
                  <p><strong>Good for:</strong></p>
                  <div className="mood-tags">
                    {skill.for_moods.split(',').map((mood) => (
                      <span key={mood} className="mood-tag">
                        {mood.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="skill-instructions">
                  <strong>How to:</strong>
                  <p>{skill.instructions}</p>
                </div>

                <button
                  className="add-btn"
                  onClick={() => handleAddSkill(skill.id)}
                >
                  Add to My Skills
                </button>

              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}