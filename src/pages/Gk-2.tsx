import Canvas from "@/components/Canvas";
import Line from "@/components/Line";
import React, { useEffect, useRef, useState } from "react";
import rgbHex from "rgb-hex";

type Props = {};

const Gk2 = (props: Props) => {
    const [selectedFile, setSelectedFile] = useState();
    const [ppmAsString, setPpmAsString]: any = useState("");
    const [ppmFormat, setPpmFormat] = useState("");
    const [ppmWidth, setPpmWidth] = useState(0);
    const [ppmHeight, setPpmHeight] = useState(0);
    const [ppmMaxColorValue, setPpmMaxColorValue] = useState("");
    const [ppmData, setPpmData] = useState("");
    const canvasRef = useRef<any>(null!);

    const uploadFile = (event: any) => {
        setSelectedFile(event.target.files[0]);

        var file = event.target.files[0];
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
        console.log(words);
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
        draw();
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
        // context!.strokeStyle = color;

        context.fillStyle = color; //not working (always black)
        // context?.beginPath();
        // context.rect(ax, ay, bx, by);
        // context?.stroke();
        context.fillRect(ax, ay, bx, by);
    };

    const draw = () => {
        // console.log("drawing");
        // console.log(ppmWidth);
        // for (let i = 0; i < ppmWidth; i++) {
        //     console.log(i);
        //     for (let j = 0; j < ppmHeight; j++) {
        //         console.log(j);
        //         let colorHex = rgbHex(
        //             parseInt(ppmData[i + j]),
        //             parseInt(ppmData[i + j + 1]),
        //             parseInt(ppmData[i + j + 2])
        //         );
        //         console.log(colorHex);
        //         strokeRectangle(canvasRef, i, j, 1, 1, colorHex);
        //     }
        // }
        // console.log("end drawing");
        const words = ppmAsString.split(/[\n ]+/);
        console.log("drawing");

        let x = words.slice(4);
        for (let i = 0; i < words[1]; i++) {
            console.log("cord x: " + i);
            for (let j = 0; j < words[2]; j++) {
                console.log("cord y: " + j);
                let colorHex = rgbHex(
                    parseInt(x[i + j]),
                    parseInt(x[i + j + 1]),
                    parseInt(x[i + j + 2])
                );
                
                console.log("color hex " + colorHex);
                strokeRectangle(canvasRef, i, j, 1, 1, colorHex);
            }
        }
        console.log("end drawing");
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.canvas.width = 500;
        context.canvas.height = 500;
    }, []);

    return (
        <div>
            <canvas ref={canvasRef}></canvas>
            <input type="file" name="file" onChange={(e) => uploadFile(e)} />
            <div>
                <button onClick={() => handleSubmission()}>Submit</button>
            </div>
            {/* <img src={ppmAsString} /> */}
        </div>
    );
};

export default Gk2;
