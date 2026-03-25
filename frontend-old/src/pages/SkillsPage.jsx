import React, { useState, useEffect } from 'react'
import { getAllSkills, getUserSkills, addUserSkill, removeUserSkill, markSkillAsPracticed } from '../services/api'
import './SkillsPage.css'

export default function SkillsPage({ user }) {
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
      setAllSkills(allSkillsRes.data)
      setUserSkills(userSkillsRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load skills:', error)
      setLoading(false)
    }
  }

  const handleAddSkill = async (skillId) => {
    try {
      await addUserSkill(skillId)
      await loadSkills()
    } catch (error) {
      console.error('Failed to add skill:', error)
    }
  }

  const handleRemoveSkill = async (skillId) => {
    try {
      await removeUserSkill(skillId)
      await loadSkills()
    } catch (error) {
      console.error('Failed to remove skill:', error)
    }
  }

  const handlePractice = async (skillId) => {
    try {
      await markSkillAsPracticed(skillId)
      await loadSkills()
    } catch (error) {
      console.error('Failed to mark skill as practiced:', error)
    }
  }

  const getAvailableSkills = () => {
    const userSkillIds = userSkills.map(s => s.id)
    return allSkills.filter(skill => !userSkillIds.includes(skill.id))
  }

  const filteredUserSkills = userSkills.filter(skill =>
    skill.name.toLowerCase().includes(filter.toLowerCase()) ||
    skill.description.toLowerCase().includes(filter.toLowerCase())
  )

  const filteredAvailableSkills = getAvailableSkills().filter(skill =>
    skill.name.toLowerCase().includes(filter.toLowerCase()) ||
    skill.description.toLowerCase().includes(filter.toLowerCase())
  )

  if (loading) {
    return <div className="skills-page"><p>Loading...</p></div>
  }

  return (
    <div className="skills-page">
      <div className="skills-header">
        <h1>🎯 Coping Skills</h1>
        <p>Learn and practice skills to manage your emotions</p>
      </div>

      <div className="skills-search">
        <input
          type="text"
          placeholder="Search skills..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

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

      {/* My Skills Tab */}
      {activeTab === 'my-skills' && (
        <div className="skills-grid">
          {filteredUserSkills.length === 0 ? (
            <p className="no-skills">No skills yet. Discover some! 🌟</p>
          ) : (
            filteredUserSkills.map(skill => (
              <div key={skill.id} className="skill-card my-skill">
                <div className="skill-header">
                  <h3>{skill.name}</h3>
                  <span className={`category-badge ${skill.category}`}>
                    {skill.category}
                  </span>
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
                    ✓ Practiced Today
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

      {/* Discover Tab */}
      {activeTab === 'discover' && (
        <div className="skills-grid">
          {filteredAvailableSkills.length === 0 ? (
            <p className="no-skills">No more skills to discover! 🎉</p>
          ) : (
            filteredAvailableSkills.map(skill => (
              <div key={skill.id} className="skill-card">
                <div className="skill-header">
                  <h3>{skill.name}</h3>
                  <span className={`category-badge ${skill.category}`}>
                    {skill.category}
                  </span>
                </div>
                <p className="skill-description">{skill.description}</p>
                
                <div className="skill-moods">
                  <p><strong>Good for:</strong></p>
                  <div className="mood-tags">
                    {skill.for_moods.split(',').map(mood => (
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
                  + Add to My Skills
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
