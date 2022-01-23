import React from "react"
import { GatsbyImage } from "gatsby-plugin-image"
import * as styles from "../css/bg-image.module.css"

const BgImg = ({ image }) => (
    <div className={styles.container}>
        <GatsbyImage className={styles.image} image={image} />
    </div>
)

export default BgImg