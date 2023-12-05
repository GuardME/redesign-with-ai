import React from 'react'
import Logo from "@/components/Logo"
import Usermenu from "@/components/UserMenu"
import Container from '@/components/Container'

const navbar = () => {
  return (
    <div className="w-full bg-white shadow-sm">
        <div className="py-4 border-b-[1px]">
            <Container>
                <div className="flex justify-between item-center">
                    <Logo />
                    <Usermenu />
                </div>
            </Container>
        </div>
    </div>
  )
}

export default navbar
