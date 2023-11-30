<template>
  <div id="app">

  </div>
</template>

<script>
import { Scene, PerspectiveCamera, WebGLRenderer, DirectionalLight } from 'three';
// import { GLTFLoader } from "@/lib/GLTFLoader";
// import { OrbitControls } from "@/lib/OrbitControls"
// import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export default {
  name: 'App',
  components: {},
  mounted() {
    let scene = new Scene();
    let camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    let loader = new GLTFLoader();/*实例化加载器*/
    let renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    let app = document.getElementById("app")
    app.appendChild(renderer.domElement);
    //加载模型
    loader.load('/the_attic_environment/scene.gltf', function (obj) {

      console.log(obj);
      obj.scene.position.y = 1;
      scene.add(obj.scene);

    }, function (xhr) {

      console.log((xhr.loaded / xhr.total * 100) + '% loaded');

    }, function (error) {
      console.log('load error!' + error);

    });

    //加载场景控制插件
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 3;
    controls.enablePan = true;
    controls.enableKeys = true;
    controls.keyPanSpeed = 7;
    controls.keys = {
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      BOTTOM: 40
    }
    this.controls = controls;
    //添加一个光源
    let light = new DirectionalLight(0xffffff);//光源颜色
    light.position.set(20, 10, 1305);//光源位置
    scene.add(light);//光源添加到场景中

    camera.position.z = 5;
    //渲染场景
    let animate = function () {
      requestAnimationFrame(animate);

      renderer.render(scene, camera);
    };

    animate();
  }
}
</script>

<style>
#app {}

body,
html {
  margin: 0;
  padding: 0;
}
</style>
