const kebabCase = require(`lodash.kebabcase`)

const projectsPath = `content/projects`

const mdxResolverPassthrough =
  (fieldName) => async (source, args, context, info) => {
    const type = info.schema.getType(`Mdx`)
    const mdxNode = context.nodeModel.getNodeById({
      id: source.parent,
    })
    const resolver = type.getFields()[fieldName].resolve
    const result = await resolver(mdxNode, args, context, {
      fieldName,
    })
    return result
  }

// Create general interfaces that you could can use to leverage other data sources
// The core theme sets up MDX as a type for the general interface
exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes, createFieldExtension } = actions

  const slugify = (source) => {
    const slug = source.slug ? source.slug : kebabCase(source.title)

    return `/${slug}` //`/${basePath}/${slug}`.replace(/\/\/+/g, `/`)
  }

  createFieldExtension({
    name: `slugify`,
    extend() {
      return {
        resolve: slugify,
      }
    },
  })

  createFieldExtension({
    name: `mdxpassthrough`,
    args: {
      fieldName: `String!`,
    },
    extend({ fieldName }) {
      return {
        resolve: mdxResolverPassthrough(fieldName),
      }
    },
  })

  createFieldExtension({
    name: `defaultFalse`,
    extend() {
      return {
        resolve(source, _args, _context, info) {
          if (source[info.fieldName] == null) {
            return false
          }
          return source[info.fieldName]
        },
      }
    },
  })

  createTypes(`
      interface Project implements Node {
        id: ID!
        slug: String! @slugify
        title: String!
        defer: Boolean @defaultFalse
        client: String!
        service: String!
        color: String!
        date: Date! @dateformat
        cover: File! @fileByRelativePath
        excerpt(pruneLength: Int = 160): String!
        body: String!
      }
      type MdxProject implements Node & Project {
        title: String!
        defer: Boolean @defaultFalse
        slug: String! @slugify
        client: String!
        service: String!
        color: String!
        date: Date! @dateformat
        cover: File! @fileByRelativePath
        excerpt(pruneLength: Int = 140): String! @mdxpassthrough(fieldName: "excerpt")
        body: String! @mdxpassthrough(fieldName: "body")
      }
    `)
}

exports.onCreateNode = ({ node, actions, getNode, createNodeId, createContentDigest }) => {
    const { createNode, createParentChildLink } = actions
  
    // Make sure that it's an MDX node
    if (node.internal.type !== `Mdx`) {
      return
    }
  
    // Create a source field
    // And grab the sourceInstanceName to differentiate the different sources
    // In this case "projectsPath" and "pagesPath"
    const fileNode = getNode(node.parent)
    const source = fileNode.sourceInstanceName
  
    // Check for "projects" and create the "Project" type
    if (node.internal.type === `Mdx` && source === projectsPath) {
      const fieldData = {
        slug: node.frontmatter.slug ? node.frontmatter.slug : undefined,
        title: node.frontmatter.title,
        client: node.frontmatter.client,
        cover: node.frontmatter.cover,
        date: node.frontmatter.date,
        service: node.frontmatter.service,
        color: node.frontmatter.color,
        defer: node.frontmatter.defer,
      }
  
      const mdxProjectId = createNodeId(`${node.id} >>> MdxProject`)
  
      createNode({
        ...fieldData,
        // Required fields
        id: mdxProjectId,
        parent: node.id,
        children: [],
        internal: {
          type: `MdxProject`,
          contentDigest: createContentDigest(fieldData),
          content: JSON.stringify(fieldData),
          description: `Mdx implementation of the Project interface`,
        },
      })
  
      createParentChildLink({ parent: node, child: getNode(mdxProjectId) })
    }
  }

  // These template are only data-fetching wrappers that import components
const projectTemplate = require.resolve(`./src/templates/project-query.js`)
const projectsTemplate = require.resolve(`./src/templates/all-projects-query.js`)

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

//   const { basePath, formatString } = withDefaults(themeOptions)

  createPage({
    path: '/projects',
    component: projectsTemplate,
  })

  const result = await graphql(`
    query {
      allProject(sort: { fields: date, order: DESC }) {
        nodes {
          slug
          defer
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`There was an error loading your projects or pages`, result.errors)
    return
  }

  const projects = result.data.allProject.nodes

  projects.forEach((project) => {
    createPage({
      path: project.slug,
      component: projectTemplate,
      context: {
        slug: project.slug,
        formatString: `DD.MM.YYYY`,
      },
      defer: project.defer,
    })
  })
}
