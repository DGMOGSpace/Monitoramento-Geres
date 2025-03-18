import { useEffect, useState } from "react";
export function useItemsPerPage(itemHeight: number, offset: number = 0) {
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      const availableHeight = window.innerHeight - offset;
      const newItemsPerPage = Math.max(1, Math.floor(availableHeight / itemHeight));
      setItemsPerPage(newItemsPerPage);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [itemHeight, offset]);

  return itemsPerPage;
}