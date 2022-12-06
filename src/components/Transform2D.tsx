import React, { useEffect, useRef, useState } from 'react'

type Props = {}

interface Point {
  x: number
  y: number
}

class Shape {
  points: Point[]
  
  constructor(points: Point[]) {
    this.points = points
  }
}

function Transform2D({}: Props) {
  const canvasRef = useRef(null)
  const [pointX, setPointX] = useState(0)
  const [pointY, setPointY] = useState(0)
  const [scaleX, setScaleX] = useState(0)
  const [scaleY, setScaleY] = useState(0)
  const [rotateAngle, setRotateAngle] = useState(0)
  const [draggingX, setDraggingX] = useState(0)
  const [draggingY, setDraggingY] = useState(0)
  const [vectorX, setVectorX] = useState(0)
  const [vectorY, setVectorY] = useState(0)
  const [inputVectorX, setInputVectorX] = useState(0)
  const [inputVectorY, setInputVectorY] = useState(0)
  const [points, setPoints] = useState<Point[]>([])
  const [shapes, setShapes] = useState<Shape[]>([])
  const [isMoving, setIsMoving] = useState(false)
  const [activeShape, setActiveShape] = useState<Shape | null>(null)
  const [modifiedShape, setModifiedShape] = useState<Shape | null>(null)

  const onAddShape = () => {
    const newShapes = [...shapes, new Shape([...points])]
    setShapes([...newShapes])
    setPoints([])
    // draw(null)
  }

  const onScaleShape = () => {
    console.log(activeShape)
    console.log(shapes)
    let newPoints: Point[] = []
    for(let point of activeShape!.points) {
      console.log(`shape points: ${point.x}, ${point.y}`)
      console.log(scaleX, scaleY)
      console.log(`dragging points: ${draggingX}, ${draggingY}`)
      const newX = draggingX + (point.x - draggingX) * scaleX
      const newY = draggingY + (point.y - draggingY) * scaleY
      console.log(`pushing point: x:${newX}, y:${newY}`)
      newPoints.push({x: newX, y: newY})
    }
    const newShape = new Shape([...newPoints])
    console.log(newShape)
    let copyShapes = [...shapes]
    copyShapes[copyShapes.indexOf(activeShape!)] = newShape!
    setModifiedShape(newShape)
    setShapes(copyShapes)
    draw(newShape)
  }

  const onRotateShape = () => {
    let newPoints: Point[] = []
    let radians = rotateAngle * Math.PI / 180
    for(let point of activeShape!.points) {
      const newX = draggingX + (point.x - draggingX) * Math.cos(radians) - (point.y - draggingY) * Math.sin(radians)
      const newY = draggingY + (point.x - draggingX) * Math.sin(radians) + (point.y - draggingY) * Math.cos(radians)
      newPoints.push({x: newX, y: newY})
    }
    const newShape = new Shape([...newPoints])
    console.log(newShape)
    let copyShapes = [...shapes]
    copyShapes[copyShapes.indexOf(activeShape!)] = newShape!
    setModifiedShape(newShape)
    setShapes(copyShapes)
    draw(newShape)
  }

  const getBoundingShape = (e: MouseEvent) => {
    console.log('xD')
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
    console.log(canvas.offsetTop)
    console.log(canvas.offsetLeft)
    let mouseX = e.offsetX - canvas.offsetLeft
    let mouseY = e.offsetY
    let intersects = false
    let boundingShape = null
    console.log(`${mouseX}, ${mouseY}`)

    for(let shape of shapes) {
      let pointsLen = shape.points.length
      for(let i = 0, j = pointsLen - 1; i < pointsLen; j = i++) {
        if(((shape.points[i].y > mouseY) != (shape.points[j].y > mouseY))
          && mouseX < (shape.points[j].x - shape.points[i].x) * (mouseY - shape.points[i].y) / (shape.points[j].y - shape.points[i].y) + shape.points[i].x) {
            intersects = !intersects
          }
      }
      if(intersects) { 
        console.log(shape)
        setActiveShape(shape)
        setDraggingX(mouseX)
        setDraggingY(mouseY)
        setIsMoving(true)
        return
      }
    }
  }

  const move = () => {
    let newPoints: Point[] = activeShape?.points.map(point => { return {x: point.x + inputVectorX, y: point.y + inputVectorY} as Point })!
    let newShape = new Shape(newPoints)
    let copyShapes = [...shapes]
    if(newShape) {
      // replace activeShape with newShape
      copyShapes[copyShapes.indexOf(activeShape!)] = newShape
    }
    setShapes(copyShapes)
    setModifiedShape(newShape)
    setActiveShape(newShape)
    draw(newShape)

  }

  const draw = (newShape: Shape | null = modifiedShape) => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
    let copyShapes = [...shapes]
    if(newShape) {
      // replace activeShape with newShape
      copyShapes[copyShapes.indexOf(activeShape!)] = newShape
    }
    ctx.clearRect(0, 0, 800, 600) 
    if(draggingX && draggingY) {
      ctx.fillRect(draggingX, draggingY, 5, 5)
    }
    for(let shape of copyShapes) {
      let pointsLen = shape?.points.length
      for(let i = 0, j = pointsLen - 1; i < pointsLen; j = i++) {
        ctx.beginPath()
        ctx.moveTo(shape?.points[i].x, shape?.points[i].y)
        ctx.lineTo(shape?.points[j].x, shape?.points[j].y)
        ctx.stroke()        
      }
    }
  }

  const stopDrawing = (e: MouseEvent) => {
    let copyShapes = [...shapes]
    copyShapes[copyShapes.indexOf(activeShape!)] = modifiedShape!
    setShapes(copyShapes)
    setModifiedShape(null)
    setIsMoving(false)
    setActiveShape(modifiedShape)
    // setDraggingX(0)
    // setDraggingY(0)
    // draw(e)
  }

  const calculateVector = (e: MouseEvent) => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const newX = e!.clientX - canvas.offsetLeft
    const newY = e!.offsetY
    setVectorX(newX - draggingX)
    setVectorY(newY - draggingY) 
    // setDraggingX(newX)
    // setDraggingY(newY)
  }

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext("2d")
    ctx!.canvas.width = 800
    ctx!.canvas.height = 600
  }, [])

  useEffect(() => {
    draw()
  }, [shapes, modifiedShape])

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    if(!isMoving) { return }
    let newPoints: Point[] = activeShape?.points.map(point => { return {x: point.x + vectorX, y: point.y + vectorY} as Point })!
    let newShape = new Shape(newPoints)
    setModifiedShape(newShape)
    draw(newShape)
  }, [vectorX, vectorY])

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const onMouseMove = (e: MouseEvent) => calculateVector(e)
    canvas.addEventListener('mousemove', onMouseMove)
    return () => {
      canvas.removeEventListener('mousemove', onMouseMove)
    }
  }, [draggingX, draggingY])
  
  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const onMouseDown = (e: MouseEvent) => getBoundingShape(e)
    const onMouseMove = (e: MouseEvent) => draw()
    const onMouseUp = (e: MouseEvent) => stopDrawing(e)
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mouseup', onMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mouseup', onMouseUp)
  }
    // const onMouseUp = (e: MouseEvent) => endDrawing()
  }, [shapes, points, activeShape, isMoving, draggingX, draggingY, modifiedShape]);

  return (
    <div>
      <div>Draw shape</div>
      <div>
        <input placeholder='x' onChange={(e) => setPointX(parseInt(e.target.value))}></input>
        <input placeholder='y' onChange={(e) => setPointY(parseInt(e.target.value))}></input>
      </div>
      <div>Move</div>
      <div>
        <input placeholder="vector x" onChange={(e) => setInputVectorX(parseInt(e.target.value))}></input>
        <input placeholder="vector y" onChange={(e) => setInputVectorY(parseInt(e.target.value))}></input>
        <button onClick={() => move()}>Move</button>
      </div>
      <div>
        <button onClick={() => setPoints([...points, {x: pointX, y: pointY}])}>Add point</button>
        <button onClick={() => onAddShape()}>Draw shape</button>
      </div>
      <div>Scale</div>
      <div>
        <input placeholder='scale x' onChange={(e) => setScaleX(parseFloat(e.target.value))}></input>
        <input placeholder='scale y' onChange={(e) => setScaleY(parseFloat(e.target.value))}></input>
      </div>
      <div>
        <button onClick={() => onScaleShape()}>Scale shape</button>
      </div>
      <div>Rotate</div>
      <div>
        <input placeholder='angle' onChange={(e) => setRotateAngle(parseInt(e.target.value))}></input>
      </div>
      <div>
        <button onClick={() => onRotateShape()}>Rotate shape</button>
      </div>
      {JSON.stringify(points)}
      <div>
        <canvas ref={canvasRef}></canvas>
      </div>

    </div>
  )
}

export default Transform2D