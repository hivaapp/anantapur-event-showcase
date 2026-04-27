import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: "up" | "fade" | "scale" | "left" | "right";
  as?: "div" | "section" | "article" | "li";
};

export function Reveal({ children, delay = 0, className = "", variant = "up", as: Tag = "div" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hidden: Record<string, string> = {
    up: "opacity-0 translate-y-8",
    fade: "opacity-0",
    scale: "opacity-0 scale-95",
    left: "opacity-0 -translate-x-8",
    right: "opacity-0 translate-x-8",
  };

  const style: CSSProperties = { transitionDelay: `${delay}ms` };

  return (
    <Tag
      // @ts-expect-error - dynamic tag ref typing
      ref={ref}
      style={style}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
        visible ? "opacity-100 translate-x-0 translate-y-0 scale-100" : hidden[variant]
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
