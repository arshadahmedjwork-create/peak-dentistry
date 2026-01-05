
/**
 * Creates a ripple effect on an element when clicked
 */
export const createRipple = (event: React.MouseEvent<HTMLElement>) => {
  const element = event.currentTarget;
  
  const circle = document.createElement("span");
  const diameter = Math.max(element.clientWidth, element.clientHeight);
  const radius = diameter / 2;
  
  const rect = element.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.style.position = "absolute";
  circle.style.borderRadius = "50%";
  circle.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
  circle.style.transform = "scale(0)";
  circle.style.animation = "ripple 600ms linear";
  
  const ripple = element.getElementsByClassName("ripple")[0];
  if (ripple) {
    ripple.remove();
  }
  
  circle.classList.add("ripple");
  element.appendChild(circle);
  
  // Add ripple animation style if it doesn't exist
  if (!document.getElementById("ripple-animation")) {
    const style = document.createElement("style");
    style.id = "ripple-animation";
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

/**
 * HOC that adds ripple effect to an onClick handler
 */
export const withRippleEffect = <T extends HTMLElement>(
  onClick?: React.MouseEventHandler<T>
): React.MouseEventHandler<T> => {
  return (event: React.MouseEvent<T>) => {
    createRipple(event);
    onClick?.(event);
  };
};
