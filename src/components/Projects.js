import React from "react"
import { useTrail } from "react-spring"
import ProjectPreview from "./ProjectPreview"

const ProjectsList = ({ data: { allProject: { nodes: projects } } }) => {

  const trail = useTrail(projects.length, {
    from: { height: `0%` },
    to: { height: `100%` },
  })

  return (
    <div className='grid auto-cols-fr w-full'>
      {trail.map((style, index) => (
        <ProjectPreview
          style={style}
          eager={index === 0}
          node={projects[index]}
          key={projects[index].slug}
        />
      ))}
    </div>
  )
}

export default ProjectsList
