import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Scroll3DWrapper({ 
  children, 
  className = "", 
  style = {},
  intensity = 1,
  direction = "up" // "up", "down", "left", "right"
}) {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Calculate rotation based on direction
  // As element scrolls from bottom to top of viewport:
  // scrollYProgress goes from 0 to 1
  
  // A subtle depth effect
  const translateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-50 * intensity, 0, -50 * intensity]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  // Rotations for 3D tumbling/flipping feel
  let rotateX, rotateY;

  switch (direction) {
    case "up":
      rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [20 * intensity, 0, -20 * intensity]);
      rotateY = useTransform(scrollYProgress, [0, 1], [0, 0]);
      break;
    case "down":
      rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [-20 * intensity, 0, 20 * intensity]);
      rotateY = useTransform(scrollYProgress, [0, 1], [0, 0]);
      break;
    case "left":
      rotateX = useTransform(scrollYProgress, [0, 1], [0, 0]);
      rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [20 * intensity, 0, -20 * intensity]);
      break;
    case "right":
      rotateX = useTransform(scrollYProgress, [0, 1], [0, 0]);
      rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-20 * intensity, 0, 20 * intensity]);
      break;
    default:
      rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [20 * intensity, 0, -20 * intensity]);
      rotateY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        perspective: "1000px",
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        z: translateZ,
        scale
      }}
    >
      {children}
    </motion.div>
  );
}
