import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function WisdomOrb3D() {
  const groupRef = useRef<THREE.Group>(null)
  const auraRef = useRef<THREE.Mesh>(null)

  const particles = useMemo(() => {
    const count = 800
    const positions = new Float32Array(count * 3)
    const radius = 0.75

    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2
      const phi = Math.acos((i / count) * 2 - 1)
      const r = radius + (Math.random() - 0.5) * 0.05

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }

    return positions
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
      groupRef.current.rotation.x += delta * 0.2
    }
    if (auraRef.current) {
      auraRef.current.rotation.y -= delta * 0.3
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      auraRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
            count={particles.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          color="#2df872"
          sizeAttenuation={true}
          transparent={true}
          opacity={1}
        />
      </points>

      <mesh ref={auraRef}>
        <sphereGeometry args={[1.15, 64, 64]} />
        <meshStandardMaterial
          color="#2df872"
          transparent={true}
          opacity={0.2}
          emissive="#2df872"
          emissiveIntensity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.35, 64, 64]} />
        <meshStandardMaterial
          color="#2df872"
          transparent={true}
          opacity={0.12}
          emissive="#2df872"
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

