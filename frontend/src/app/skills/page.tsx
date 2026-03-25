import { getAllSkills, getUserSkills } from '../../lib/api'
import SkillsManager from '../../components/SkillsManager'

export default async function SkillsPage() {
  let allSkills = []
  let userSkills = []

  try {
    [allSkills, userSkills] = await Promise.all([getAllSkills(), getUserSkills()])
  } catch (error) {
    console.error('Failed to load skills:', error)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Skills</h1>
        <p className="text-gray-600">Manage your coping skills and techniques</p>
      </div>

      <SkillsManager allSkills={allSkills} userSkills={userSkills} />
    </div>
  )
}