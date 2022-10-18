import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import {faCircle, faCoffee, faGripLines, faRectangleXmark, faVectorSquare} from '@fortawesome/free-solid-svg-icons'
import styles from 'styles/gk-1.module.scss'

type Props = {
  canvasRef: any
}

enum Tool {
  Circle,
  Line,
  Rectangle
}

function Draw({ canvasRef }: Props) {
  const [activeTool, setActiveTool] = useState(Tool.Line)
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  const trackPosition = (e: MouseEvent, canvas: HTMLCanvasElement) => {
    setStartX(e.clientX - canvas.offsetLeft)
    setStartY(e.clientY - canvas.offsetTop)
    setIsDrawing(true)
  }
  
  const drawPreview = (e: MouseEvent, canvas: HTMLCanvasElement) => {
    e.preventDefault()
    e.stopPropagation()
    if(!isDrawing) { return }
    const ctx = canvas!.getContext('2d')
    ctx!.strokeStyle = "#000000"
    ctx!.lineWidth = 1;
    switch(activeTool) {
      case Tool.Circle:
        ctx?.clearRect(startX - (2*Math.sign(e.clientX - startX)), startY - (2*Math.sign(e.offsetY - startY)), e.clientX - startX + (4*Math.sign(e.clientX - startX)), e.offsetY - startY + (4*Math.sign(e.offsetY - startY)))
        ctx?.beginPath()
        ctx?.moveTo(startX, startY + (e.offsetY - startY) / 2)
        ctx?.bezierCurveTo(startX, startY, e.offsetX, startY, e.offsetX, startY + (e.offsetY - startY) / 2)
        ctx?.bezierCurveTo(e.offsetX, e.offsetY, startX, e.offsetY, startX, startY + (e.offsetY - startY) / 2)
        ctx?.stroke();
        break
      case Tool.Rectangle:
        ctx?.clearRect(startX - (2*Math.sign(e.clientX - startX)), startY - (2*Math.sign(e.offsetY - startY)), e.clientX - startX + (4*Math.sign(e.clientX - startX)), e.offsetY - startY + (4*Math.sign(e.offsetY - startY)))
        ctx?.strokeRect(startX, startY, e.clientX - startX, e.offsetY - startY)
        break
      case Tool.Line:
        ctx?.beginPath()
        ctx?.moveTo(startX, startY)
        ctx?.lineTo(e.clientX, e.offsetY)
        ctx!.strokeStyle = "#FFFFFF"
        ctx!.lineWidth = 5
        ctx?.stroke()
        ctx!.strokeStyle = "#000000"
        ctx!.lineWidth = 1
        ctx?.stroke()
        break
    }
  }
  
  const draw = (e: MouseEvent, canvas: HTMLCanvasElement) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDrawing(false)
    const ctx = canvas!.getContext('2d')
    switch(activeTool) {
      case Tool.Circle:
  
        break
      case Tool.Rectangle:
        ctx?.strokeRect(startX, startY, e.clientX - startX, e.offsetY - startY)
        break
      case Tool.Line:
        ctx?.beginPath()
        ctx?.moveTo(startX, startY)
        ctx?.lineTo(e.clientX, e.offsetY)
        ctx?.stroke()
        // ctx?.fill()
        break
  
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    console.log(canvas)
    const onMouseDown = (e: MouseEvent) => trackPosition(e, canvas)
    const onMouseMove = (e: MouseEvent) => drawPreview(e, canvas)
    const onMouseUp = (e: MouseEvent) => draw(e, canvas)
    canvasRef.current.addEventListener('mousedown', onMouseDown)
    canvasRef.current.addEventListener('mousemove', onMouseMove)
    canvasRef.current.addEventListener('mouseup', onMouseUp)
    return () => {
      console.log('destroying')
      // canvasRef.current.removeEventListener('mousedown', onMouseDown)
      // canvasRef.current.removeEventListener('mousemove', onMouseMove)
      // canvasRef.current.removeEventListener('mouseup', onMouseUp)
    }
  }, [activeTool, startX, startY, isDrawing])

  return (
    <div>
      <button onClick={() => setActiveTool(Tool.Rectangle)}>
        <FontAwesomeIcon icon={faVectorSquare} className={activeTool === Tool.Rectangle ? styles.active : ''}></FontAwesomeIcon>
      </button>
      <button onClick={() => setActiveTool(Tool.Circle)} className={activeTool === Tool.Circle ? styles.active : ''}>
        <FontAwesomeIcon icon={faCircle}></FontAwesomeIcon>
      </button>
      <button onClick={() => setActiveTool(Tool.Line)} className={activeTool === Tool.Line ? styles.active : ''}>
        <FontAwesomeIcon icon={faGripLines}></FontAwesomeIcon>
      </button>
    </div>
  )
}

export default Draw