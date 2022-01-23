import * as React from "react"
import BgImg from "./BgImage"

const Hero = ({ children, color = ``, image, slim = false }) => (
  <section className="relative w-full overflow-hidden">
    <BgImg image={image} />
    {children}
  </section>
)

export default Hero
