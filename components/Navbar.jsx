import React from "react";
import Container from "@/components/Container";
import Logo from "@/components/Logo";
import UserMenu from "@/components/UserMenu";

const Navbar = () => {
  return (
    <div className="w-full bg-white border-black shadow-sm z-0">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex justify-between item-center">
            <Logo />
            <UserMenu />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
