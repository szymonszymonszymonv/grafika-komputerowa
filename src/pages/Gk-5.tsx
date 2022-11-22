import React from 'react'
import { Link, Outlet } from 'react-router-dom'

type Props = {}

function Gk5({}: Props) {
  return (
    <div>
      <ul>
        <li><Link to="histogram">histogram</Link></li>
        <li><Link to="binaryzacja">binaryzacja</Link></li>
      </ul>
      <Outlet />
    </div>
  )
}

export default Gk5