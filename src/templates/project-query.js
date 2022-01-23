import { graphql } from "gatsby"
import ProjectComponent from "../components/Project"

export default ProjectComponent

export const query = graphql`
  query ($slug: String!, $formatString: String!) {
    project(slug: { eq: $slug }) {
      body
      excerpt
      client
      color
      date(formatString: $formatString)
      service
      slug
      title
      cover {
        childImageSharp {
          gatsbyImageData(quality: 90, layout: FULL_WIDTH)
          resize(width: 800) {
            src
          }
        }
      }
    }
    carousel: allFile(
      filter: {
        extension: { regex: "/(jpg)|(png)/" }
        absolutePath: { regex: $slug }
        name: { regex: "/carousel/" }
      }
    ) {
      edges {
        node {
          name
          childImageSharp {
            gatsbyImageData(quality: 90, layout: FULL_WIDTH)
            resize(width: 800) {
              src
            }
          }
        }
      }
    }
  }
`
