import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js"
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/GLTFLoader.js"

window.addEventListener("load", () => {
  init()
})

async function init() {
  const params = {
    planeColor: "#fcfffd",
    backgroundColor: "#ffffff",
    fogColor: "#ffffff",
  }

  const h2 = document.querySelector("h2")

  gsap.registerPlugin(ScrollTrigger)
  const canvas = document.querySelector("#canvas")

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas,
  })

  renderer.shadowMap.enabled = true
  renderer.setSize(window.innerWidth, window.innerHeight)

  const scene = new THREE.Scene()

  scene.fog = new THREE.Fog(params.fogColor, 1, 25)

  //   console.log(THREE.Fog)

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500
  )

  // OrbitControls - import required
  //   const controls = new OrbitControls(camera, renderer.domElement)

  // axes helper
  const axesHelper = new THREE.AxesHelper(5)
  //   scene.add(axesHelper)

  // plane
  const planeGeometry = new THREE.PlaneGeometry(50, 50)
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: params.planeColor,
    side: THREE.DoubleSide,
    roughness: 1,
  })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = Math.PI * 0.5

  plane.position.y = -5

  plane.receiveShadow = true
  scene.add(plane)

  const clock = new THREE.Clock()

  const gltfLoader = new GLTFLoader()
  const gltf = await gltfLoader.loadAsync("./models/nami.gltf")
  const mouth = gltf.scene

  mouth.castShadow = true
  mouth.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true
    }
  })

  mouth.update = () => {
    const elapsedTime = clock.getElapsedTime()

    mouth.position.y = Math.sin(elapsedTime * 2) - 3
  }

  mouth.scale.set(100, 100, 100)
  mouth.position.set(0, 0, 0)
  mouth.rotation.x = Math.PI * 1.9
  mouth.rotation.y = Math.PI * 1.8

  scene.add(mouth)

  //camera
  camera.position.set(2, 3, 4)
  camera.lookAt(mouth.position)

  //DirectionalLight & AmbientLight
  const pointLight = new THREE.PointLight(0xfcfffd, 5, 3, 1)
  pointLight.position.set(0, 2, 2)

  //   pointLight.castShadow = true
  //   pointLight.shadow.mapSize.width = 1024
  //   pointLight.shadow.mapSize.height = 1024
  //   pointLight.shadow.radius = 20

  scene.add(pointLight)

  const directionalLight = new THREE.DirectionalLight(0xfcfffd, 1)
  directionalLight.position.set(0, 5, 2)

  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 1024
  directionalLight.shadow.mapSize.height = 1024
  directionalLight.shadow.radius = 20

  scene.add(directionalLight)

  const light = new THREE.AmbientLight(0xfcfffd, 0.3) // soft white light
  scene.add(light)

  // render = animate
  renderer.render(scene, camera)

  function render() {
    mouth.update()

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  render()

  // resize
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera)
  }
  window.addEventListener("resize", handleResize)

  // GUI

  //gsap

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".wrapper",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  })

  tl.to(params, {
    planeColor: "#34444f",
    onUpdate: () => {
      planeMaterial.color = new THREE.Color(params.planeColor)
    },
    duration: 1.5,
  })
    .to(
      params,
      {
        backgroundColor: "#232323",
        onUpdate: () => {
          scene.background = new THREE.Color(params.backgroundColor)
        },
        duration: 1.5,
      },
      "<"
    )
    .to(
      params,
      {
        fogColor: "#232323",
        onUpdate: () => {
          scene.fog.color = new THREE.Color(params.fogColor)
        },
        duration: 1.5,
      },
      "<"
    )
    .to(
      camera.position,
      {
        x: 0,
        y: 0,
        z: 2,
        duration: 1,
      },
      "<"
    )
    .to(
      camera.position,
      {
        x: 10,
        y: 2,
        z: 3,
        duration: 1,
      },
      ">"
    )
    .to(
      camera.rotation,
      {
        y: 90 * (Math.PI / 180),
        duration: 1,
      },
      "<"
    )

  gsap.to(h2, {
    opacity: 0,
    scrollTrigger: {
      trigger: ".wrapper",
      start: "top top",
      end: "+=500",
      scrub: true,
    },
  })
}
