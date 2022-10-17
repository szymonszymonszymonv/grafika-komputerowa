import React, { useState } from 'react'

type Props = {
  canvasRef: any
}

const strokeCircle = (canvasRef: any, ax: number, ay: number, r: number) => {
  const canvas = canvasRef.current
  const context = canvas.getContext('2d')
  context!.strokeStyle = "#000000"

  context?.beginPath()
  context?.arc(ax, ay, r, 0, 2*Math.PI)
  context?.stroke()
}

function Circle({ canvasRef }: Props) {
  const [paramAx, setParamAx] = useState(0)
  const [paramAy, setParamAy] = useState(0)
  const [paramR, setParamR] = useState(0)

  return (
    <div>
      <div>rysuj okrag</div>
      <input placeholder='punkt X' onChange={(e) => setParamAx(parseInt(e.target.value)) } />
      <input placeholder='punkt Y' onChange={(e) => setParamAy(parseInt(e.target.value)) } />
      <input placeholder='promien' onChange={(e) => setParamR(parseInt(e.target.value)) } />
      <button onClick={() => strokeCircle(canvasRef, paramAx, paramAy, paramR)}>rysuj</button>
    </div>
  )
}

export default Circle