import React from "react"
import { Link } from "gatsby"
import { animated } from "react-spring"
import { GatsbyImage } from "gatsby-plugin-image"
import * as classes from "../css/project-preview.module.css"

const ProjectPreview = ({ node, style, eager }) => (
  <animated.div className={classes.container} style={style}>
    <div className={classes.item}>
      <div className={classes.imageContainer}>
        <GatsbyImage
          loading={eager ? `eager` : `lazy`}
          image={node.cover.childImageSharp.gatsbyImageData}
          alt=""
        />
      </div>
      <Link to={node.slug} aria-label={`View detail page of ${node.title}`}>
        <div
          className={classes.itemColor}
          style={{ backgroundColor: node.color }}
        />
      </Link>
    </div>
  </animated.div>
)

export default ProjectPreview
