import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CenterRevealWrapper({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"]
  );

  return (
    <motion.div ref={ref} className={className} style={{ ...style, clipPath }}>
      {children}
    </motion.div>
  );
}
