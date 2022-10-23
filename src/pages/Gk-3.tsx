import Cube from '@/components/Cube'
import React, { useEffect, useRef } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three'

type Props = {}

function Gk3({}: Props) {

  return (
    // <Cube />
    <div>
      <ul>
        <li><Link to="color-picker">color picker</Link></li>
        <li><Link to="cube">cube</Link></li>
      </ul>
      <Outlet />
    </div>
  )
}

export default Gk3