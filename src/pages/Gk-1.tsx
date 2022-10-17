import Canvas from '@/components/Canvas'
import Line from '@/components/Line'
import React, { useRef, useState } from 'react'

type Props = {}



const Gk1 = (props: Props) => {
  const [paramA, setParamA] = useState(0)
  const [paramB, setParamB] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  return (
    <div>
      <Canvas canvasRef={canvasRef}></Canvas>
    </div>
  )
}

export default Gk1