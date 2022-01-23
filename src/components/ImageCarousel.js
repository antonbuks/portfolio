import { GatsbyImage } from "gatsby-plugin-image"
import React from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel"

const ImageCarousel = ({ images }) => (
  <Carousel swipeable={true} emulateTouch={true}>
    {Object.values(images.edges).map((image, idx) => (
      <div>
        <GatsbyImage image={image.node.childImageSharp.gatsbyImageData} />
      </div>
    ))}
  </Carousel>
)

export default ImageCarousel
