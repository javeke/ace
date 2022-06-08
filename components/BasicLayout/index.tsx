import { ReactElement } from "react";
import Navbar from "../Navbar";

interface BasicLayoutProps {
  children: ReactElement;
}


export default function BasicLayout({children}: BasicLayoutProps){
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}