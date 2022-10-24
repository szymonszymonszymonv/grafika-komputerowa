import React, { useEffect, useRef } from "react";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

type Props = {};

function Cube({}: Props) {
    const sceneRef = useRef<HTMLDivElement>(null);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // const geometryCone = new THREE.ConeGeometry(5, 5, 5);
    // const materialCone = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    // const cone = new THREE.Mesh(geometryCone, materialCone);
    // scene.add(cone);

    const renderer = new THREE.WebGLRenderer();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "#FF0000" });
    const cube = new THREE.Mesh(geometry, material);

    var geo = new THREE.EdgesGeometry(cube.geometry);
    var mat = new THREE.LineBasicMaterial({ color: 0x000000 });
    var wireframe = new THREE.LineSegments(geo, mat);
    cube.add(wireframe);

    cube.rotation.x = 0.2;
    cube.rotation.y = 0.2;
    scene.add(cube);

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

export default Cube;
