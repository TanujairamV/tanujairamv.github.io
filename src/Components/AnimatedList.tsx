import React, {
  useRef,
  useState,
  useEffect,
  ReactNode,
  MouseEventHandler,
} from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  delay = 0,
  index,
  onMouseEnter,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={inView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.9, opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: (delay || 0) + index * 0.05, ease: "easeOut" }}
      className="mb-4"
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  items: any[];
  renderItem: (item: any, isSelected: boolean) => ReactNode;
  getKey: (item: any) => string | number;
  onItemSelect?: (item: any, index: number) => void;
  enableArrowNavigation?: boolean;
  className?: string;
  initialSelectedIndex?: number;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  renderItem,
  getKey,
  onItemSelect,
  enableArrowNavigation = true,
  className = "",
  initialSelectedIndex = -1,
}) => {
  const [selectedIndex, setSelectedIndex] =
    useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0) return;
    // The list is now part of the main page flow, so we query the document
    // and scroll the window to the selected item.
    const selectedItem = document.querySelector(
      `[data-index="${selectedIndex}"]`
    ) as HTMLElement | null;
    if (selectedItem) {
      selectedItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <div className={`w-full ${className}`}>
      {items.map((item, index) => (
        <AnimatedItem
          key={getKey(item)}
          delay={0.1}
          index={index}
          onMouseEnter={() => setSelectedIndex(index)}
          onClick={() => {
            setSelectedIndex(index);
            if (onItemSelect) {
              onItemSelect?.(item, index);
            }
          }}
        >
          {renderItem(item, selectedIndex === index)}
        </AnimatedItem>
      ))}
    </div>
  );
};

export default AnimatedList;
