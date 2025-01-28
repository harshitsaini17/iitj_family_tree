import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Helper function to parse branch path data
function parseBranchPath(d) {
  const parts = d.split(/[ ,]/).filter((p) => p !== "");
  const x0 = parseFloat(parts[1]);
  const y0 = parseFloat(parts[2]);
  const x1 = parseFloat(parts[4]);
  const y1 = parseFloat(parts[5]);
  const x2 = parseFloat(parts[6]);
  const y2 = parseFloat(parts[7]);
  const x3 = parseFloat(parts[8]);
  const y3 = parseFloat(parts[9]);
  return { x0, y0, x1, y1, x2, y2, x3, y3 };
}

// Helper function to calculate a point on a cubic Bezier curve
function bezierPoint(t, x0, y0, x1, y1, x2, y2, x3, y3) {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const x = mt3 * x0 + 3 * mt2 * t * x1 + 3 * mt * t2 * x2 + t3 * x3;
  const y = mt3 * y0 + 3 * mt2 * t * y1 + 3 * mt * t2 * y2 + t3 * y3;
  return { x, y };
}

const Loader = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const branches = [
    "M50 60 C40 55 30 50 25 55",
    "M50 60 C60 55 70 50 75 55",
    "M50 50 C40 45 35 35 30 40",
    "M50 50 C60 45 65 35 70 40",
    "M50 40 C45 35 40 25 35 30",
    "M50 40 C55 35 60 25 65 30",
  ];

  let leaves = [];
  let leafId = 0;
  branches.forEach((branchPath, branchIndex) => {
    const points = parseBranchPath(branchPath);
    const tValues = [0.3, 0.5, 0.7, 0.9];

    tValues.forEach((t) => {
      const point = bezierPoint(
        t,
        points.x0,
        points.y0,
        points.x1,
        points.y1,
        points.x2,
        points.y2,
        points.x3,
        points.y3
      );

      leaves.push({
        id: leafId++,
        x: point.x,
        y: point.y,
        size: 3 + Math.random() * 2,
        delay: 0.2 + branchIndex * 0.1 + t * 0.1,
        color: leafId % 3 === 0 ? "#9BB572" : "#4A7C59",
      });
    });
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-64 h-64 relative"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d="M20 80 Q50 75 80 80"
            stroke="#2E5B3E"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
          />

          <motion.path
            d="M50 80 C50 80 45 60 50 40"
            stroke="#2E5B3E"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />

          {branches.map((d, i) => (
            <motion.path
              key={`branch-${i}`}
              d={d}
              stroke="#2E5B3E"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
            />
          ))}

          {leaves.map(({ id, x, y, size, delay, color }) => (
            <motion.path
              key={`leaf-${id}`}
              d={`M ${x - size} ${y} 
                  C ${x} ${y - size} ${x + size} ${y} ${x + size} ${y}
                  C ${x + size} ${y} ${x} ${y + size} ${x - size} ${y}`}
              fill={color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [y, y - 1, y],
              }}
              transition={{
                duration: 0.2,
                delay: 1 + delay,
                y: {
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: 1 + delay,
                },
              }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
};


export default Loader;
