import { useRef } from "react";

export function useEnterKeyFocusControl()  {
  const ref = useRef(new Map<number, HTMLElement>());
  return (index: number) => ({
    onkeyDown({ key } : {key:string}){
      if(key !== "Enter") { return; }
      console.log("Enter");
      const sortedIndies = [...ref.current.keys()].sort();
      const nextIndex = sortedIndies[sortedIndies.indexOf(index) + 1];
      if(typeof nextIndex === "number") { ref.current.get(nextIndex)?.focus(); }
    },
    ref(element: HTMLElement | null){
      if(element) {
        ref.current.set(index, element);
      }else{
        ref.current.delete(index);
      }
    },
  });
}