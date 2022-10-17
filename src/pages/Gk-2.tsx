import Canvas from "@/components/Canvas";
import Line from "@/components/Line";
import React, { useRef, useState } from "react";

type Props = {};

const Gk2 = (props: Props) => {
    const [selectedFile, setSelectedFile] = useState();
    const changeHandler = (event: any) => {
        setSelectedFile(event.target.files[0]);
    };
    const canvasRef = useRef<HTMLCanvasElement>(null!);

    const handleSubmission = () => {
        const formData = new FormData();

        formData.append("File", selectedFile!);
        console.log(selectedFile);
        console.log(formData);
    };

    return (
        <div>
            <p> test </p>
            <canvas ref={canvasRef}></canvas>
            <input type="file" name="file" onChange={changeHandler} />
            <div>
                <button onClick={handleSubmission}>Submit</button>
            </div>
        </div>
    );
};

export default Gk2;
