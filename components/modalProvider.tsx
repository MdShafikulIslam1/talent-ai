"use client";
import { useEffect, useState } from "react";
import ProModal from "./proModal";

const ModalProvider = () => {
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  }, []);
  if (!isMount) {
    return null;
  }
  return (
    <>
      <ProModal />
    </>
  );
};

export default ModalProvider;
