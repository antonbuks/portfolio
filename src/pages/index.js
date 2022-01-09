import * as THREE from 'three'
import { Detailed, Environment, useGLTF } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'
import React, { Suspense, useRef, useState } from "react"
import "../style.css"

function Banana({ index, z, speed }) {
  const ref = useRef()
  // useThree gives you access to the R3F state model
  const { viewport, camera } = useThree()
  // getCurrentViewport is a helper that calculates the size of the viewport
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, -z])
  const { nodes, materials } = useGLTF("/banana-v1-transformed.glb")

  // Local component state, it is safe to mutate because it's fixed data
  const [data] = useState({
    // Randomly distributing the objects along the vertical
    y: THREE.MathUtils.randFloatSpread(height * 2),
    // This gives us a random value between -1 and 1, we will multiply it with the viewport width
    x: THREE.MathUtils.randFloatSpread(2),
    // How fast objects spin, randFlost gives us a value between min and max, in this case 8 and 12
    spin: THREE.MathUtils.randFloat(8, 12),
    // Some random rotations, Math.PI represents 360 degrees in radian
    rX: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  })

  // useFrame executes 60 times per second
  useFrame((state, dt) => {
    // Make the X position responsive, slowly scroll objects up at the Y, distribute it along the Z
    // dt is the delta, the time between this frame and the previous, we can use it to be independent of the screens refresh rate
    // We cap dt at 0.1 because now it can't accumulate while the user changes the tab, it will simply stop
    if (dt < 0.1)
      ref.current.position.set(
        index === 0 ? 0 : data.x * width,
        (data.y += dt * speed),
        -z
      )
    // Rotate the object around
    ref.current.rotation.set(
      (data.rX += dt / data.spin),
      Math.sin(index * 1000 + state.clock.elapsedTime / 10) * Math.PI,
      (data.rZ += dt / data.spin)
    )
    // If they're too far up, set them back to the bottom
    if (data.y > height * (index === 0 ? 4 : 1))
      data.y = -(height * (index === 0 ? 4 : 1))
  })

  return (
    <Detailed ref={ref} distances={[0, 65, 80]}>
      <mesh
        geometry={nodes.banana_high.geometry}
        material={materials.skin}
        material-emissive="#ff9f00"
      />
      <mesh
        geometry={nodes.banana_mid.geometry}
        material={materials.skin}
        material-emissive="#ff9f00"
      />
      <mesh
        geometry={nodes.banana_low.geometry}
        material={materials.skin}
        material-emissive="#ff9f00"
      />
    </Detailed>
  )
}

function Bananas({
  speed = 1,
  count = 80,
  depth = 80,
  easing = (x) => Math.sqrt(1 - Math.pow(x - 1, 2)),
}) {
  return (
    // No need for alpha and antialias (faster), dpr clamps the resolution to 1.5 (also faster than full resolution)
    <Canvas
      gl={{ alpha: false, antialias: false }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 20, near: 0.01, far: depth + 15 }}
    >
      <color attach="background" args={["#ffbf40"]} />
      <spotLight
        position={[10, 20, 10]}
        penumbra={1}
        intensity={3}
        color="orange"
      />
      {/* Using cubic easing here to spread out objects a little more interestingly, i wanted a sole big object up front ... */}
      {Array.from(
        { length: count },
        (_, i) => <Banana key={i} index={i} z={Math.round(easing(i / count) * depth)} speed={speed} /> /* prettier-ignore */
      )}
      <Environment preset="sunset" />
      {/* Multisampling (MSAA) is WebGL2 antialeasing, we don't need it (faster) */}
      <EffectComposer multisampling={0}>
        <DepthOfField
          target={[0, 0, 60]}
          focalLength={0.5}
          bokehScale={11}
          height={700}
        />
      </EffectComposer>
    </Canvas>
  )
}

export default () => {
  const [speed, set] = useState(1)
  const isSSR = typeof window === "undefined"

  return (
    <main>
      {!isSSR && (
        <Suspense fallback={null}>
          <Bananas speed={speed} />
        </Suspense>
      )}
    </main>
  )
}
