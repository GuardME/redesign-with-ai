import React from "react";
import Link from "next/link";

const Logo = () => {
    return (
       <div className="flex justify-center items-center">
         <Link href="/">
            <p className="font-bold text-xl text-[#033664] tracking-wide">
                ReDesign Ai
            </p>
         </Link> 
       </div>   
    )
}

export default Logo