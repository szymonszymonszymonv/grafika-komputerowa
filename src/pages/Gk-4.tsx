import Cube from '@/components/Cube'
import React, { useEffect, useRef } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three'

type Props = {}

function Gk4({}: Props) {

  return (
    // <Cube />
    <div>
      <ul>
        <li><Link to="przeksztalcenia-punktowe">przeksztalcenia punktowe</Link></li>
        <li><Link to="polepszanie-jakosci">polepszanie jakosci</Link></li>
      </ul>
      <Outlet />
    </div>
  )
}

export default Gk4
