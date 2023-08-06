import { useCallback, useRef, useState } from "react";

const useLongTouch = (
  onLongTouchStart: (e: React.TouchEvent<HTMLDivElement>, ...args) => void,
  onLongTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void = function(){},
  { shouldPreventDefault = true, delay = 400 } = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const targetRef = useRef({});

  const start = useCallback(
    (event: React.TouchEvent<HTMLDivElement>, ...args) => {
      console.log(event, ...args)
      // if (shouldPreventDefault && event.target) {
      //   event.target.addEventListener("touchend", preventDefault, {
      //     passive: false
      //   });
      //   targetRef.current = event.target;
      // }
      timeoutRef.current = setTimeout((event, ...args) => {
        onLongTouchStart(event, ...args);
        setLongPressTriggered(true);
      }, delay, event, ...args);
    },
    [onLongTouchStart, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (event:  React.TouchEvent<HTMLDivElement>, ...args) => {
      console.log(event, ...args)
      timeoutRef.current && clearTimeout(timeoutRef.current);
      onLongTouchEnd(event, ...args);
      setLongPressTriggered(false);

      if (shouldPreventDefault && targetRef.current) {
        targetRef.current?.removeEventListener?.("touchend", preventDefault);
      }
    },
    [shouldPreventDefault, onLongTouchEnd, longPressTriggered]
  );

  return {
    onLongTouchStart: (e:  React.TouchEvent<HTMLDivElement>, ...args) => start(e, ...args),
    onLongTouchEnd: (e:  React.TouchEvent<HTMLDivElement>, ...args) => clear(e, ...args)
  };
};

const isTouchEvent = (event:  React.TouchEvent<HTMLDivElement>) => {
  return "touches" in event;
};

const preventDefault = (event:  React.TouchEvent<HTMLDivElement>) => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

export default useLongTouch;
