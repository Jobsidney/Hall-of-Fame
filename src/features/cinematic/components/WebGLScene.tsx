import { useEffect, useRef, Suspense, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, PerspectiveCamera, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import entranceHDR from '../../../assets/wakanda-forever-master.dogstudio-dev.co/zerolimits/glxp/environment/HDRI_Entrance_02_opti.jpg'
import hallHDR from '../../../assets/wakanda-forever-master.dogstudio-dev.co/zerolimits/glxp/environment/HDRI_Hall_02_opti.jpg'
import wakandaModelUrl from '../../../assets/wakanda-forever-master.dogstudio-dev.co/zerolimits/glxp/models/wakanda_scene_09_draco.glb?url'

export type SceneType = 'entrance' | 'hall'
export type HallView = 'center' | 'left' | 'right' | 'back'

interface SceneConfig {
  hdri: string
  cameraPosition: [number, number, number]
  cameraRotation: [number, number, number]
  panIntensityX: number
  panIntensityY: number
  fov: number
}

const SCENE_CONFIGS: Record<SceneType, SceneConfig> = {
  entrance: {
    hdri: entranceHDR,
    cameraPosition: [-35, 8, 0],
    cameraRotation: [0, -Math.PI / 2, 0],
    panIntensityX: 0.02,
    panIntensityY: 0.04,
    fov: 65,
  },
  hall: {
    hdri: hallHDR,
    cameraPosition: [0, 2.5, 20],
    cameraRotation: [0, 0, 0],
    panIntensityX: 0.03,
    panIntensityY: 0.06,
    fov: 65,
  },
}

const HALL_VIEWS: Record<HallView, { position: [number, number, number]; rotation: [number, number, number] }> = {
  center: {
    position: [0, 2.5, 16],
    rotation: [0, 0, 0],
  },
  left: {
    position: [-12, 2.5, 10],
    rotation: [0, Math.PI * 0.15, 0],
  },
  right: {
    position: [12, 2.5, 10],
    rotation: [0, -Math.PI * 0.15, 0],
  },
  back: {
    position: [0, 3, -8],
    rotation: [0, Math.PI, 0],
  },
}

function ExposureController({ currentScene }: { currentScene: SceneType }) {
  const { gl } = useThree()
  
  useEffect(() => {
    const exposure = currentScene === 'hall' ? 2.5 : 1.5
    gl.toneMappingExposure = exposure
  }, [currentScene, gl])

  return null
}

function CameraDebugger() {
  const { camera } = useThree()
  
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Camera:', {
        posX: camera.position.x.toFixed(2),
        posY: camera.position.y.toFixed(2),
        posZ: camera.position.z.toFixed(2),
        rotX: camera.rotation.x.toFixed(3),
        rotY: camera.rotation.y.toFixed(3),
        fov: (camera as THREE.PerspectiveCamera).fov.toFixed(3),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [camera])

  return (
    <OrbitControls
      enablePan={true}
      enableZoom={true}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
    />
  )
}

interface WakandaModelProps {
  playDoorAnimation: boolean
  onDoorOpened: () => void
  onEnterHall: () => void
}

function WakandaModel({ playDoorAnimation, onDoorOpened, onEnterHall }: WakandaModelProps) {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF(wakandaModelUrl)
  const doorLeftRef = useRef<THREE.Object3D | null>(null)
  const doorRightRef = useRef<THREE.Object3D | null>(null)
  const hasAnimated = useRef(false)
  const { camera } = useThree()

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.name === 'Door_L') {
          doorLeftRef.current = child
          console.log('🚪 Door_L position:', child.position.toArray())
          console.log('🚪 Door_L rotation:', child.rotation.toArray())
        }
        if (child.name === 'Door_R') {
          doorRightRef.current = child
          console.log('🚪 Door_R position:', child.position.toArray())
          console.log('🚪 Door_R rotation:', child.rotation.toArray())
        }
      })
    }
  }, [scene])

  useEffect(() => {
    if (playDoorAnimation && !hasAnimated.current && doorLeftRef.current && doorRightRef.current) {
      hasAnimated.current = true
      console.log('🎬 Starting door animation...')
      console.log('Door_L initial Z rotation:', doorLeftRef.current.rotation.z)
      console.log('Door_R initial Z rotation:', doorRightRef.current.rotation.z)
      
      const tl = gsap.timeline()
      
      tl.to(doorLeftRef.current.rotation, {
        z: doorLeftRef.current.rotation.z + Math.PI * 0.4,
        duration: 2.5,
        ease: 'power2.inOut',
      }, 0)
      .to(doorRightRef.current.rotation, {
        z: doorRightRef.current.rotation.z - Math.PI * 0.4,
        duration: 2.5,
        ease: 'power2.inOut',
      }, 0)
      .add(() => {
        console.log('🚪 Doors opened!')
        onDoorOpened()
      })
      .to(camera.position, {
        x: 0,
        y: 2.5,
        z: 10,
        duration: 3.5,
        ease: 'power2.inOut',
      }, '-=1')
      .to(camera.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 3.5,
        ease: 'power2.inOut',
      }, '-=3.5')
      .add(() => {
        console.log('🏛️ Entered hall!')
        onEnterHall()
      })
    }
  }, [playDoorAnimation, onDoorOpened, onEnterHall, camera])

  return (
    <group ref={group} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  )
}

interface SceneContentProps {
  enableControls?: boolean
  currentScene: SceneType
  isTransitioning: boolean
  onTransitionComplete: () => void
  use3DModel: boolean
  onCameraControlReady?: (moveToView: (view: HallView) => void) => void
}

function SceneContent({ 
  enableControls = false, 
  currentScene, 
  isTransitioning, 
  onTransitionComplete,
  use3DModel,
  onCameraControlReady
}: SceneContentProps) {
  const { camera } = useThree()
  const cameraRef = useRef(camera as THREE.PerspectiveCamera)
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const currentHallView = useRef<HallView>('center')
  const isAnimating = useRef(false)
  
  const handleDoorOpened = useCallback(() => {
    console.log('🚪 Doors fully opened')
  }, [])

  const handleEnterHall = useCallback(() => {
    onTransitionComplete()
  }, [onTransitionComplete])

  const moveToView = useCallback((view: HallView) => {
    if (currentScene !== 'hall' || isAnimating.current || !cameraRef.current) return
    
    const viewConfig = HALL_VIEWS[view]
    if (!viewConfig) return
    
    isAnimating.current = true
    currentHallView.current = view
    
    gsap.to(cameraRef.current.position, {
      x: viewConfig.position[0],
      y: viewConfig.position[1],
      z: viewConfig.position[2],
      duration: 1.5,
      ease: 'power2.inOut',
    })
    
    gsap.to(cameraRef.current.rotation, {
      x: viewConfig.rotation[0],
      y: viewConfig.rotation[1],
      z: viewConfig.rotation[2],
      duration: 1.5,
      ease: 'power2.inOut',
      onComplete: () => {
        isAnimating.current = false
      }
    })
  }, [currentScene])

  useEffect(() => {
    if (currentScene === 'hall' && onCameraControlReady) {
      onCameraControlReady(moveToView)
    }
  }, [currentScene, onCameraControlReady, moveToView])

  useEffect(() => {
    cameraRef.current = camera as THREE.PerspectiveCamera
    const cam = cameraRef.current
    const config = SCENE_CONFIGS[currentScene]

    if (use3DModel && !enableControls && !isAnimating.current) {
      if (currentScene === 'hall') {
        const viewConfig = HALL_VIEWS[currentHallView.current]
        cam.position.set(...viewConfig.position)
        cam.rotation.set(...viewConfig.rotation)
      } else {
        cam.position.set(...config.cameraPosition)
        cam.rotation.set(...config.cameraRotation)
      }
      cam.fov = config.fov
      cam.updateProjectionMatrix()
    }
  }, [camera, enableControls, use3DModel, currentScene])

  useEffect(() => {
    if (enableControls) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.body.getBoundingClientRect()
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [enableControls])

  useFrame(() => {
    if (!cameraRef.current || enableControls || isTransitioning || isAnimating.current) return

    targetRef.current.x += (mouseRef.current.x - targetRef.current.x) * 0.05
    targetRef.current.y += (mouseRef.current.y - targetRef.current.y) * 0.05

    const config = SCENE_CONFIGS[currentScene]

    if (use3DModel) {
      if (currentScene === 'hall') {
        const viewConfig = HALL_VIEWS[currentHallView.current]
        const baseRotX = viewConfig.rotation[0]
        const baseRotY = viewConfig.rotation[1]
        cameraRef.current.rotation.x = baseRotX - targetRef.current.y * config.panIntensityX
        cameraRef.current.rotation.y = baseRotY - targetRef.current.x * config.panIntensityY
      } else {
        const baseRotX = config.cameraRotation[0]
        const baseRotY = config.cameraRotation[1]
        cameraRef.current.rotation.x = baseRotX - targetRef.current.y * config.panIntensityX
        cameraRef.current.rotation.y = baseRotY - targetRef.current.x * config.panIntensityY
      }
    }
  })

  return (
    <>
      {currentScene === 'hall' ? (
        <>
          <ambientLight intensity={0.8} color="#2df872" />
          <directionalLight position={[0, 10, 5]} intensity={0.4} color="#2df872" />
          <directionalLight position={[0, 5, -5]} intensity={0.3} color="#2df872" />
          {use3DModel && (
            <WakandaModel 
              playDoorAnimation={false} 
              onDoorOpened={handleDoorOpened}
              onEnterHall={handleEnterHall}
            />
          )}
        </>
      ) : (
        <>
          <ambientLight intensity={1.2} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <directionalLight position={[-10, 5, -5]} intensity={0.4} />
          {use3DModel && (
            <WakandaModel 
              playDoorAnimation={isTransitioning} 
              onDoorOpened={handleDoorOpened}
              onEnterHall={handleEnterHall}
            />
          )}
        </>
      )}
    </>
  )
}

interface WebGLSceneProps {
  currentScene: SceneType
  isTransitioning: boolean
  onTransitionComplete?: () => void
  onCameraControlReady?: (moveToView: (view: HallView) => void) => void
}

export function WebGLScene({ currentScene, isTransitioning, onTransitionComplete, onCameraControlReady }: WebGLSceneProps) {
  const [enableControls, setEnableControls] = useState(false)
  const [activeHDRI, setActiveHDRI] = useState(SCENE_CONFIGS[currentScene].hdri)
  const [showFlash, setShowFlash] = useState(false)
  const [use3DModel, setUse3DModel] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleTransitionComplete = useCallback(() => {
    setShowFlash(true)
    setActiveHDRI(SCENE_CONFIGS.hall.hdri)
    
    setTimeout(() => {
      setShowFlash(false)
      onTransitionComplete?.()
    }, 600)
  }, [onTransitionComplete])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'c' || e.key === 'C') {
        setEnableControls((prev) => {
          console.log('OrbitControls:', !prev ? 'ON' : 'OFF')
          return !prev
        })
      }
      if (e.key === 'm' || e.key === 'M') {
        setUse3DModel((prev) => {
          console.log('3D Model:', !prev ? 'ON' : 'OFF')
          return !prev
        })
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const config = SCENE_CONFIGS[currentScene]

  return (
    <div className="webgl">
      <Canvas
        ref={canvasRef}
        gl={{ 
          antialias: true, 
          alpha: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: currentScene === 'hall' ? 2.2 : 1.5,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        dpr={[1, 2]}
        camera={{ 
          position: config.cameraPosition, 
          rotation: config.cameraRotation,
          fov: config.fov 
        }}
      >
        <PerspectiveCamera 
          makeDefault 
          position={config.cameraPosition} 
          rotation={config.cameraRotation}
          fov={config.fov} 
        />
        <ExposureController currentScene={currentScene} />
        <Suspense fallback={null}>
          <Environment 
            files={activeHDRI} 
            background={!use3DModel}
            environmentIntensity={currentScene === 'hall' ? 2.0 : 1.0}
          />
        </Suspense>
        {enableControls && <CameraDebugger />}
        <SceneContent 
          enableControls={enableControls} 
          currentScene={currentScene}
          isTransitioning={isTransitioning}
          onTransitionComplete={handleTransitionComplete}
          use3DModel={use3DModel}
          onCameraControlReady={onCameraControlReady}
        />
      </Canvas>
      
      {showFlash && (
        <div 
          className="webgl__flash"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(45, 248, 114, 0.9) 0%, rgba(255, 255, 255, 1) 60%, #fff 100%)',
            animation: 'flash 0.8s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}
      
      {enableControls && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(0,0,0,0.85)',
            color: '#2df872',
            padding: '12px 16px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px',
            zIndex: 1000,
            lineHeight: 1.6,
          }}
        >
          <strong>Debug Controls</strong>
          <br />
          Drag to rotate | Scroll to zoom
          <br />
          <span style={{ color: '#888' }}>C</span> = Toggle controls
          <br />
          <span style={{ color: '#888' }}>M</span> = Toggle 3D model ({use3DModel ? 'ON' : 'OFF'})
        </div>
      )}
    </div>
  )
}

useGLTF.preload(wakandaModelUrl)
