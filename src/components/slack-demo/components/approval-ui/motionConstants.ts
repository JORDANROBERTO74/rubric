export const DEMO_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const DEMO_SPRING = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 30
}

export const DEMO_SPRING_SOFT = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 28
}

export const escalationContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
}

export const escalationItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: DEMO_EASE }
  }
}
