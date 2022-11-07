import React, { useEffect, useRef } from "react";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

type Props = {};

function Cone({}: Props) {
    const sceneRef = useRef<HTMLDivElement>(null);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const Frame = (shapeType: any) => {
        let geo = new THREE.EdgesGeometry(shapeType.geometry);
        let mat = new THREE.LineBasicMaterial({ color: "#000000" });
        let frame = new THREE.LineSegments(geo, mat);

        return frame;
    };

    const geometryCone = new THREE.ConeGeometry(1, 1, 10);
    const materialCone = new THREE.MeshBasicMaterial({ color: "#FFF000" });
    const cone = new THREE.Mesh(geometryCone, materialCone);

    cone.rotation.x = 1;
    cone.rotation.y = 1;

    cone.add(Frame(cone));
    scene.add(cone);

    const renderer = new THREE.WebGLRenderer();

    camera.position.z = 5;
    renderer.setSize(window.innerWidth, window.innerHeight);

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    const animate = () => {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
        controls.update();
    };
    animate();

    useEffect(() => {
        sceneRef.current?.appendChild(renderer.domElement);
    }, []);

    return <div ref={sceneRef}></div>;
}

export default Cone;
