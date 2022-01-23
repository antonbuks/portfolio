import * as React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Hero from "./Hero"
import ImageCarousel from "./ImageCarousel"

const Project = ({ data }) => {
  const { project, carousel } = data
  return (
    <React.Fragment>
      <Hero
        image={project.cover.childImageSharp.gatsbyImageData}
        color={project.color}
      >
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl my-0 mx-auto p-4 z-2 flex-col">
          <h1 className="text-6xl">{project.title}</h1>
          <div className="flex mt-4 mb-2 flex-wrap">{project.date}</div>
        </div>
      </Hero>
      <div className="max-w-5xl my-0 mx-auto p-4">
        <MDXRenderer>{project.body}</MDXRenderer>
      </div>
      {carousel.edges.length && (
        <div className="max-w-5xl my-0 mx-auto p-4">
          <ImageCarousel images={carousel} />
        </div>
      )}
    </React.Fragment>
  )
}

export default Project
