import "./Header.css";
import type { ReactNode } from "react";

type HeaderProps = {
  title: string;
  leftChild?: ReactNode;
  rightChild?: ReactNode;
};

const Header = ({ title, leftChild, rightChild }: HeaderProps) => {
  return (
    <header className="Header">
      <div className="header_left">{leftChild}</div>
      <div className="header_center">{title}</div>
      <div className="header_right">{rightChild}</div>
    </header>
  );
};

export default Header;