import breathingIcon from '../assets/skill-icons/breathing.svg'
import mindfulnessIcon from '../assets/skill-icons/mindfulness.svg'
import journalIcon from '../assets/skill-icons/journal.svg'
import brainIcon from '../assets/skill-icons/brain.svg'
import movementIcon from '../assets/skill-icons/movement.svg'
import peopleIcon from '../assets/skill-icons/people.svg'
import leafIcon from '../assets/skill-icons/leaf.svg'
import musicIcon from '../assets/skill-icons/music.svg'

export const SKILL_ICONS = {
  breathing: breathingIcon,
  mindfulness: mindfulnessIcon,
  journal: journalIcon,
  brain: brainIcon,
  movement: movementIcon,
  people: peopleIcon,
  leaf: leafIcon,
  music: musicIcon,
}

export const SKILL_CATEGORY_STYLES = {
  relaxation: {
    label: 'Relaxation',
    color: '#C5D6C6',
    textColor: '#283047',
    icon: 'breathing',
  },
  mindfulness: {
    label: 'Mindfulness',
    color: '#BFD0C0',
    textColor: '#283047',
    icon: 'mindfulness',
  },
  reflection: {
    label: 'Reflection',
    color: '#D3DDD1',
    textColor: '#283047',
    icon: 'journal',
  },
  cognitive: {
    label: 'Cognitive',
    color: '#AEB9C9',
    textColor: '#283047',
    icon: 'brain',
  },
  physical: {
    label: 'Physical',
    color: '#9FB3B2',
    textColor: '#283047',
    icon: 'movement',
  },
  social: {
    label: 'Social',
    color: '#C9D4E1',
    textColor: '#283047',
    icon: 'people',
  },
  nature: {
    label: 'Nature',
    color: '#B7C8B8',
    textColor: '#283047',
    icon: 'leaf',
  },
  comfort: {
    label: 'Comfort',
    color: '#B9BECF',
    textColor: '#283047',
    icon: 'music',
  },
}