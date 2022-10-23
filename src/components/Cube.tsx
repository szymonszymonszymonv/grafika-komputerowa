import React, { useEffect, useRef } from 'react'
import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three'

type Props = {}

function Cube({}: Props) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const scene = new Scene();
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new WebGLRenderer();
  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial( { color: "#FF0000" })
  const cube = new Mesh(geometry, material)
  scene.add(cube)
  camera.position.z = 5
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  const animate = () => {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera)
  }
  animate()
  useEffect(() => {
    sceneRef.current?.appendChild(renderer.domElement)
  }, [])

  return (
    <div ref={sceneRef}>
      
    </div>
  )
}

export default Cube