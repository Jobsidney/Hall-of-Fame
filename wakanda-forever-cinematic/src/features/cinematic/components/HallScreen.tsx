import { forwardRef, useState, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import marvelLogo from '../../../assets/wakanda-forever-master.dogstudio-dev.co/zerolimits/assets/images/logos/marvel-theater.webp'
import type { HallView } from './WebGLScene'
import { WisdomOrb3D } from './WisdomOrb3D'

const SpriteLogoWhite = () => (
  <svg fill="none" height="30" viewBox="0 0 70 49" width="43" xmlns="http://www.w3.org/2000/svg">
    <g fill="#fff">
      <path d="m37.0427 29.8124 3.3721-.4837 3.9746-10.1798-3.3776.4865z" />
      <path d="m21.2523 28.7925c.3372-.6744.5224-1.2963.586-1.8713.1962-1.7661-.7546-3.1039-1.9155-4.2676-.6937-.6992-1.0171-1.4179-.9508-1.9983.0166-.1576.0636-.3041.1382-.4395.3925-.7159 1.3018-.9757 2.0702-.937.0664.0028.1327.0083.1963.0166.011 0 .0193 0 .0304.0028 1.2825.1575 1.9569.9646 2.3411 1.5008l.0746.105 1.1885-3.068-.0718-.0359c-.633-.2709-1.3461-.4588-2.0979-.5528-1.5257-.188-3.2007.0138-4.6103.7214 0 0-.0037.0018-.0111.0055-1.288.6219-2.4213 1.7247-2.9243 3.5075-.0691.2432-.1161.4782-.141.7104-.1326 1.1829.3151 2.2139 1.3516 3.0652.8596.7048 1.7662 1.6142 1.6418 2.717-.0414.3732-.199.7739-.5224 1.2051-.2542.34-.7628.727-1.1995.8817-.0056 0-.0166.0056-.0249.0083-.5417.2129-1.1609.293-1.7745.2184-.8126-.0995-1.6142-.4727-2.2167-1.1692l-.141-.1548-1.5672 4.0051.0636.0221c.4616.163.9647.2543 1.4345.3316.1078.0166.2211.0332.3317.047 1.6252.2018 3.4882-.0691 5.0913-.8844h.0027.0056c.0055 0 .011-.0028.0138-.0083.0055 0 0 0 .011-.0056.0056-.0055.0166-.0083.0277-.0165.3869-.2018.7546-.434 1.1001-.7049.995-.7435 1.8435-1.7247 2.4599-2.9547z" />
      <path d="m31.5094 26.0036c.1575-.3538.2957-.8928.3676-1.2521.1465-.7545.0857-1.4953-.2322-2.0923-.3178-.597-.8955-1.042-1.7551-1.2079-.4063-.0774-.8762-.0939-1.4152-.0359l-3.8447.5638-5.1161 13.1014 3.372-.4837 3.9774-10.1881c.2598-.6468.5418-1.0393.8347-1.2438.2986-.1631.5086-.1658.6634-.1354.0138.0027.0276.0055.0415.0083.362.0884.5942.4533.5611.948-.0056.0967-.0277.3013-.083.586-.1105.5638-1.0779 3.6595-3.0348 5.5694-.2626.246-.4782.4395-.7297.6468-.1189.0995-.2377.1962-.3262.2681-.0442.0359-.0801.0663-.1078.0884-.0138.0111-.0221.0194-.0304.0249-.0027 0-.0055.0055-.0083.0055-.0055.0028-.0083.0083-.0138.0139-.0857.0635-.2487.1658-.3759.257-.0387.0332-.0691.0277-.0912.094-.0028.0166 0 .0276 0 .0387 0 .0276.0387.0636.0636.0636.0387.0055.058-.0028.0884-.0083 1.9155-.3234 3.9028-1.0448 5.6192-3.0598l.2764-.3455c.7491-.8872 1.0227-1.6169 1.2991-2.2305z" />
      <path d="m57.3775 23.8588.3013.4975-.0221.0359c-.4892.7463-1.0448 1.371-1.6308 1.8795 0 0 0 0-.0027.0028-1.1775 1.0835-3.1482 1.9403-4.7486 1.6363-.3648-.0691-.7131-.2018-1.0226-.4063-.2903-.1825-.4754-.3649-.6634-.6413-.3483-.5141-.5804-1.299-.3621-2.4212.0995-.5169.2958-1.1084.6192-1.78.6329-1.3185 1.5533-2.518 2.8137-3.4108 1.4539-1.0503 3.0404-1.4953 4.2621-1.3875.0995.0083.1934.0221.2847.0387.5168.0995.9093.3399 1.147.691.2377.3482.3151.8015.2184 1.3073-.036.1797-.0912.3621-.1686.5528-.2516.6109-.6468 1.1139-1.1167 1.523-.9287.9674-2.9657 1.5699-4.1349 1.6998-.0359.0028-.0608.0111-.1023.0056-.0166-.0028-.0414-.0138-.058-.036-.0138-.0193-.0194-.0497-.0138-.0663.0276-.0801.0773-.0884.1188-.1216.0442-.0249.0829-.0415.0829-.0415.0056-.0027.3206-.1686.4146-.2266 1.1692-.7878 2.0592-1.8298 2.5844-3.0902.0608-.1464.1105-.2764.1354-.398.047-.2349.011-.4146-.0636-.5058-.0525-.0636-.1105-.0995-.1852-.1161-.105-.0193-.2487.0083-.4173.094-.633.3179-1.6336 1.487-2.6673 4.1018-.1244.2957-.21.5749-.2598.8402-.1879.9812.105 1.6722.7021 1.8768.058.0193.1188.0359.1824.047.8015.1547 2.1697-.3013 3.7065-2.109l.0608-.0718z" />
      <path d="m35.9235 21.9572.6688-1.6861-.8651.1189-1.5395.2128-3.9719 10.1908 3.3721-.4947 2.2941-5.8763c.5777-1.6086 2.0232-1.874 3.1095-1.6667l1.2079-3.0901c-1.7552-.105-2.9188.6385-4.2787 2.2886z" />
      <path d="m45.4454 15.2766c-.0829-.1244-.1963-.2322-.3483-.3096-.3842-.199-.8734-.1106-1.2603.0415-.2267.0856-.4589.2073-.6828.3703-.4698.3317-.8126.7822-1.0475 1.2742-.1189.2516-.1935.4727-.2322.6661-.0553.2764-.047.5805.0885.8348.1354.2543.409.4229.6965.4699.3206.0525.6606-.0194.9619-.1327.2266-.0857.4588-.2073.6827-.3704.4698-.3317.8126-.7822 1.0475-1.2742.1189-.2515.1935-.4726.2322-.6661.0636-.3206.0276-.6468-.1382-.9011z" />
      <path d="m51.6175 18.1069-1.6474.2405 1.1167-2.9022-3.8364 1.6971-.6606 1.6915-.843.1217-.6634.0967-1.0089 2.5871 1.5037-.2073-2.9603 7.5816 3.3721-.4864 2.9602-7.5651 1.6418-.2294z" />
      <path d="m69.6525 13.0873c-.8789.5252-9.9863 3.2035-12.6839-.3399-2.7447-3.60703.5445-12.74477549.5445-12.74477549-25.8986 29.00257549-45.8021 6.74136549-45.8021 6.74136549 6.1692 20.35121-9.45006 25.26291-11.711 25.85991 1.72473-.3704 11.3047-1.5617 15.1273 16.3987 0 0 8.3224-12.5098 18.0046-15.868-2.6506.6136-9.9945 3.2808-16.9515 10.1908-1.0448-6.1665-6.3406-10.9454-12.86085-11.1389-.57491-.0166-1.13876.0055-1.69709.0581 7.38262-2.062 12.89404-8.7011 13.13444-16.7332.0636-2.1421-.2542-4.2096-.89-6.13609 4.7541 4.24549 10.9897 6.56169 17.8748 6.76629 9.4113.2791 17.1588-3.9774 23.1539-10.69392-.4118.74352-.6993 1.57271-.8347 2.45995-.6136 4.04377 2.1808 7.81657 6.2438 8.43017 1.5561.2349 3.0736-.0304 4.3865-.6716 0 0-9.6077 7.7364-3.3196 17.3633-6.0863-11.4761 8.2837-19.9449 8.2837-19.9449z" />
    </g>
  </svg>
)

const WisdomOrbIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" stroke="url(#wisdom-gradient)" strokeWidth="2" fill="none" />
    <circle cx="30" cy="30" r="20" stroke="url(#wisdom-gradient)" strokeWidth="1" fill="none" opacity="0.5" />
    <circle cx="30" cy="30" r="12" fill="url(#wisdom-gradient)" opacity="0.3" />
    <defs>
      <linearGradient id="wisdom-gradient" x1="0" y1="0" x2="60" y2="60">
        <stop offset="0%" stopColor="#2df872" />
        <stop offset="100%" stopColor="#00964d" />
      </linearGradient>
    </defs>
  </svg>
)

const NavArrowLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const NavArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

interface HallScreenProps {
  moveToView?: ((view: HallView) => void) | null
}

export const HallScreen = forwardRef<HTMLDivElement, HallScreenProps>(function HallScreen({ moveToView }, ref) {
  const [currentViewIndex, setCurrentViewIndex] = useState(0)
  const views: HallView[] = ['center', 'left', 'right', 'back']

  const handlePrevious = useCallback(() => {
    if (!moveToView) return
    const newIndex = (currentViewIndex - 1 + views.length) % views.length
    setCurrentViewIndex(newIndex)
    moveToView(views[newIndex])
  }, [moveToView, currentViewIndex, views])

  const handleNext = useCallback(() => {
    if (!moveToView) return
    const newIndex = (currentViewIndex + 1) % views.length
    setCurrentViewIndex(newIndex)
    moveToView(views[newIndex])
  }, [moveToView, currentViewIndex, views])

  return (
    <div ref={ref} className="hall">
      <div className="hall__header">
        <div className="hall__logo">
          <span className="hall__logo-the">THE</span>
          <span className="hall__logo-hall">HALL</span>
          <span className="hall__logo-of">OF</span>
          <span className="hall__logo-zero">ZERO</span>
          <span className="hall__logo-limits">LIMITS</span>
        </div>
      </div>

      <div className="hall__wisdom-guide">
        <div className="hall__wisdom-content">
          <div className="hall__wisdom-bubble">
            <div className="hall__wisdom-bubble-pointer" />
            <p>
              You have entered the <strong>Hall of Zero Limits.</strong> Great things lie ahead for all who open themselves to finding their gift.
            </p>
          </div>
          <div className="hall__wisdom-nav">
            <button 
              className="hall__wisdom-nav-btn" 
              aria-label="Previous"
              onClick={handlePrevious}
            >
              <NavArrowLeft />
            </button>
            <button 
              className="hall__wisdom-nav-btn hall__wisdom-nav-btn--active" 
              aria-label="Next"
              onClick={handleNext}
            >
              <NavArrowRight />
            </button>
          </div>
        </div>
        <div className="hall__wisdom-orb">
          <Canvas
            camera={{ position: [0, 0, 3], fov: 50 }}
            style={{ width: '60px', height: '60px' }}
            gl={{ alpha: true, antialias: true }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={50} />
            <ambientLight intensity={0.5} />
            <pointLight position={[2, 2, 2]} intensity={1} color="#2df872" />
            <pointLight position={[-2, -2, 2]} intensity={0.5} color="#2df872" />
            <Suspense fallback={null}>
              <WisdomOrb3D />
            </Suspense>
          </Canvas>
        </div>
        <div className="hall__wisdom-label">
          <span>WISDOM</span>
          <span>GUIDE</span>
        </div>
      </div>

      <div className="hall__center">
        <div className="hall__title">
          <span className="hall__title-the">THE HALL OF</span>
          <span className="hall__title-main">ZERO LIMITS</span>
        </div>
        <div className="hall__welcome">
          <span>WELCOME</span>
          <div className="hall__welcome-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 0V14M0 7H14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>

      <div className="hall__footer">
        <div className="hall__footer-logos">
          <div className="hall__footer-logo hall__footer-logo--sprite">
            <SpriteLogoWhite />
          </div>
          <div className="hall__footer-logo hall__footer-logo--marvel">
            <img src={marvelLogo} alt="Wakanda Forever" />
          </div>
        </div>
        <span className="hall__footer-text">Sprite Zero Sugar® | © MARVEL</span>
      </div>
    </div>
  )
})

