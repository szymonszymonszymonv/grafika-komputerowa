import React, { useEffect, useRef } from 'react'
import Circle from './Circle'
import Draw from './Draw'
import Line from './Line'
import Rectangle from './Rectangle'

type Props = {
  canvasRef: any
}

function Canvas({ canvasRef }: Props) {

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.canvas.width = 500
    context.canvas.height = 500
  }, [])

  return (
    <div>
      <Line canvasRef={canvasRef}></Line>
      <Rectangle canvasRef={canvasRef}></Rectangle>
      <Circle canvasRef={canvasRef}></Circle>
      <Draw canvasRef={canvasRef}></Draw>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Canvas