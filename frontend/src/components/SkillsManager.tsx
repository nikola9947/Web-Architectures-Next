"use client"

import { useState } from 'react'
import { addUserSkill, removeUserSkill } from '../lib/api'

interface Skill {
  id: string
  name: string
  description: string
  category: string
}

interface UserSkill {
  id: string
  skill: Skill
  // other fields
}

interface SkillsManagerProps {
  allSkills: Skill[]
  userSkills: UserSkill[]
}

export default function SkillsManager({ allSkills, userSkills }: SkillsManagerProps) {
  const [activeTab, setActiveTab] = useState('my-skills')
  const [filter, setFilter] = useState('')

  const userSkillIds = new Set(userSkills.map(us => us.skill.id))

  const filteredAllSkills = allSkills.filter(skill =>
    skill.name.toLowerCase().includes(filter.toLowerCase()) ||
    skill.description.toLowerCase().includes(filter.toLowerCase())
  )

  const filteredUserSkills = userSkills.filter(us =>
    us.skill.name.toLowerCase().includes(filter.toLowerCase()) ||
    us.skill.description.toLowerCase().includes(filter.toLowerCase())
  )

  const handleAddSkill = async (skillId: string) => {
    try {
      await addUserSkill(skillId)
      window.location.reload()
    } catch (error) {
      console.error('Failed to add skill:', error)
    }
  }

  const handleRemoveSkill = async (skillId: string) => {
    try {
      await removeUserSkill(skillId)
      window.location.reload()
    } catch (error) {
      console.error('Failed to remove skill:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('my-skills')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'my-skills' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          My Skills ({userSkills.length})
        </button>
        <button
          onClick={() => setActiveTab('all-skills')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'all-skills' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All Skills ({allSkills.length})
        </button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search skills..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      {activeTab === 'my-skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUserSkills.map((userSkill) => (
            <div key={userSkill.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
              <h3 className="font-semibold">{userSkill.skill.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{userSkill.skill.description}</p>
              <p className="text-xs text-gray-500 capitalize">{userSkill.skill.category}</p>
              <button
                onClick={() => handleRemoveSkill(userSkill.skill.id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          {filteredUserSkills.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No skills added yet. Check the All Skills tab to add some!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'all-skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAllSkills.map((skill) => (
            <div key={skill.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">{skill.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{skill.description}</p>
              <p className="text-xs text-gray-500 capitalize mb-2">{skill.category}</p>
              {userSkillIds.has(skill.id) ? (
                <button
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => handleAddSkill(skill.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Add
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}