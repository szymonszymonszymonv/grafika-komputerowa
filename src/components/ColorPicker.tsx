import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import styles from '../assets/styles/gk-3.module.scss'

type Props = {}


function ColorPicker({}: Props) {
  const [colorC, setColorC] = useState(0)
  const [colorM, setColorM] = useState(0)
  const [colorY, setColorY] = useState(0)
  const [colorK, setColorK] = useState(0)
  const [colorR, setColorR] = useState(0)
  const [colorG, setColorG] = useState(0)
  const [colorB, setColorB] = useState(0)
  const [finalColorRGB, setFinalColorRGB] = useState("")
  
  const onChangeCMYK = (setColor: (value: number) => void, value: number) => {
    setColor(value)

    // calculate rgb
    setColorR(255 * (1 - (colorC / 100)) * (1 - (colorK / 100)))
    setColorG(255 * (1 - (colorM / 100)) * (1 - (colorK / 100)))
    setColorB(255 * (1 - (colorY / 100)) * (1 - (colorK / 100)))
    // set final color
    setFinalColorRGB(`rgb(${colorR}, ${colorG}, ${colorB})`)
  }

  const onChangeRGB = (setColor: (value: number) => void, value: number) => {
    setColor(value)

    // calculate cmyk
    const k = 1 - (Math.max(colorR / 255, colorG / 255, colorB / 255))
    const c = (1 - (colorR / 255) - k) / (1 - k)
    const m = (1 - (colorG / 255) - k) / (1 - k)
    const y = (1 - (colorB / 255) - k) / (1 - k)
    setColorK(k * 100)
    setColorC(c * 100)
    setColorM(m * 100)
    setColorY(y * 100)
    // set final color
    setFinalColorRGB(`rgb(${colorR}, ${colorG}, ${colorB})`)
  }

  return (
    <div>
      <div>
        <h3>Preview</h3>
        <FontAwesomeIcon icon={faCoffee} className={styles.colorPreview} style={{color: finalColorRGB}}/>
      </div>
      <div>
        <h3>CMYK</h3>
        <div>
          <label>C: </label>
          <input type="range" min={0} max={100} value={colorC} onChange={(e) => onChangeCMYK(setColorC, parseInt(e.target.value))}></input>
          <input type="number" className={styles.cmyk} value={colorC} onChange={(e) => onChangeCMYK(setColorC, parseInt(e.target.value))}></input>
        </div>
        <div>
          <label>M: </label>
          <input type="range" min={0} max={100} value={colorM} onChange={(e) => onChangeCMYK(setColorM, parseInt(e.target.value))}></input>
          <input type="number"className={styles.cmyk} value={colorM} onChange={(e) => onChangeCMYK(setColorM, parseInt(e.target.value))}></input>
        </div>
        <div>
          <label>Y: </label>
          <input type="range" min={0} max={100} value={colorY} onChange={(e) => onChangeCMYK(setColorY, parseInt(e.target.value))}></input>
          <input type="number"className={styles.cmyk} value={colorY} onChange={(e) => onChangeCMYK(setColorY, parseInt(e.target.value))}></input>
        </div>
        <div>
          <label>K: </label>
          <input type="range" min={0} max={100} value={colorK} onChange={(e) => onChangeCMYK(setColorK, parseInt(e.target.value))}></input>
          <input type="number"className={styles.cmyk} value={colorK} onChange={(e) => onChangeCMYK(setColorK, parseInt(e.target.value))}></input>
        </div>
      </div>

      <div>
        <h3>RGB</h3>
        <div>
          <label>R: </label>
          <input type="range" min={0} max={255} value={colorR} onChange={(e) => onChangeRGB(setColorR, parseInt(e.target.value))}></input>
          <input type="number" className={styles.cmyk} value={colorR} onChange={(e) => onChangeRGB(setColorR, parseInt(e.target.value))}></input>
        </div>
        <div>
          <label>G: </label>
          <input type="range" min={0} max={255} value={colorG} onChange={(e) => onChangeRGB(setColorG, parseInt(e.target.value))}></input>
          <input type="number"className={styles.cmyk} value={colorG} onChange={(e) => onChangeRGB(setColorG, parseInt(e.target.value))}></input>
        </div>
        <div>
          <label>B: </label>
          <input type="range" min={0} max={255} value={colorB} onChange={(e) => onChangeRGB(setColorB, parseInt(e.target.value))}></input>
          <input type="number"className={styles.cmyk} value={colorB} onChange={(e) => onChangeRGB(setColorB, parseInt(e.target.value))}></input>
        </div>
      </div>
    </div>
  )
}

export default ColorPicker