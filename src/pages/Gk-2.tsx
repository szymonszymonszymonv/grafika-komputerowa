import Canvas from "@/components/Canvas";
import Line from "@/components/Line";
import React, { useEffect, useRef, useState } from "react";
import rgbHex from "rgb-hex";
import { resizeImage, IResizeImageOptions } from '../libs/resizeImage'
type Props = {};

const Gk2 = (props: Props) => {
    const [selectedFile, setSelectedFile] = useState();
    const [ppmAsString, setPpmAsString]: any = useState("");
    const [ppmFormat, setPpmFormat] = useState("");
    const [ppmWidth, setPpmWidth] = useState(0);
    const [ppmHeight, setPpmHeight] = useState(0);
    const [ppmMaxColorValue, setPpmMaxColorValue] = useState("");
    const [ppmData, setPpmData] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [imgSizeCompress, setImgSizeCompress] = useState(90);
    const canvasRef = useRef<any>(null!);

    const uploadFile = async (event: any) => {
        setSelectedFile(event.target.files[0]);

        var file = event.target.files[0];
        let config = {
            file: file,
            maxSize: imgSizeCompress
        }
        const result = await resizeImage(config);
        console.log(file)
        if(file.type === "image/jpeg") {
            console.log('no')
            setImgUrl(URL.createObjectURL(result as Blob))
        }
        var reader = new FileReader();
        reader.onload = function () {
            setPpmAsString(reader.result);
        };
        if (file) {
            // This does not return the text. It just starts reading.
            // The onload handler is triggered when it is done and the result is available.
            reader.readAsText(file);
        }
    };

    const splitPpm = () => {
        // let ppmFormat = ppmAsString.split("\n")[0];
        // setPpmFormat(ppmAsString.split("\n")[0]);
        // let ppmSize = ppmAsString.split("\n")[1];
        // setPpmSize(ppmAsString.split("\n")[1]);
        // let ppmMaxColorValue = ppmAsString.split("\n")[2];
        // setPpmMaxColorValue(ppmAsString.split("\n")[2]);
        // // let xd = ppmAsString.split("\n")[3];
        // // setPpmData(ppmAsString.split("\n")[3]);
        // let xd2 =  ppmAsString.split("\n")[2].slice(-1)
        // // console.log(ppmFormat);
        // // console.log(ppmSize);
        // // console.log(ppmMaxColorValue);
        // console.log(xd2);

        const words = ppmAsString.split(/[\n ]+/);
        console.log(words)
        setPpmFormat(words[0]);
        console.log(words[0]);
        setPpmWidth(words[1]);
        console.log(words[1]);
        setPpmHeight(words[2]);
        console.log(words[2]);
        setPpmMaxColorValue(words[3]);
        console.log(words[3]);
        setPpmData(words.slice(4));
        console.log(words.slice(4));
    };

    const handleSubmission = () => {
        const formData = new FormData();

        formData.append("File", selectedFile!);
        splitPpm();
    };

    const strokeRectangle = (
        canvasRef: any,
        ax: number,
        ay: number,
        bx: number,
        by: number,
        color: string
    ) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context!.strokeStyle = "#000000";

        context?.beginPath();
        context.rect(ax, ay, bx, by);
        context?.stroke();
    };

    const downloadFileAsJpeg = () => {

    }

    // const drawRectangle = () => {
    //     strokeRectangle(canvasRef, paramAx, paramAy, paramBx, paramBy, color);
    // };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.canvas.width = ppmWidth;
        context.canvas.height = ppmHeight;
        for (let i = 0; i < ppmWidth; i++) {
            for (let j = 0; j < ppmHeight; j++) {
                let colorHex = rgbHex(
                    parseInt(ppmData[i + j]),
                    parseInt(ppmData[i + j + 1]),
                    parseInt(ppmData[i + j + 2])
                );
                console.log(colorHex);
                strokeRectangle(canvasRef, i, j, 1, 1, colorHex);
            }
        }
    }, []);

    return (
        <div>
            <p> test </p>
            <canvas ref={canvasRef}></canvas>
            <input type="file" name="file" onChange={uploadFile} />
            <div>
                <span>compression</span>
                <input type="range" min={0} max={100} value={imgSizeCompress} onChange={(e) => setImgSizeCompress(parseInt(e.target.value))}></input>
                <span>{imgSizeCompress}</span>
            </div>
            <div>
                <button onClick={handleSubmission}>Submit</button>
            </div>
            <div>
                <a download href={imgUrl}>download</a>
            </div>
            <img src={imgUrl}></img>
            
            {/* <img src={ppmAsString} /> */}
        </div>
    );
};

export default Gk2;

