import Landing from './components/Landing/Landing'
import ViewportCanvas from './three/ViewportCanvas'
import WorkList from './components/WorkList/WorkList'
import Showcase from './components/Showcase/Showcase'
import { useView } from './viewStore'
import { projectBySlug } from './projects'

export default function App() {
  const view = useView()
  const project = view.name === 'project' ? projectBySlug(view.slug) : undefined
  return (
    <>
      <Landing />
      <ViewportCanvas />
      {view.name === 'work' && <WorkList />}
      {view.name === 'project' && project?.showcase && <Showcase project={project} />}
    </>
  )
}
