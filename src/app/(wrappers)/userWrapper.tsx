import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react'

interface UserProps {
    children: React.ReactNode;
}

export default function UserWrapper({ children }: UserProps) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    )
}
