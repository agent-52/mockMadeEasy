import type { ReactNode } from 'react';
import { Navbar } from '../components/Navbar';
import "./applayout.css"
export function AppLayout({children, backgroundColor="bg2"}: {children: ReactNode, backgroundColor:string}){
    return (
        <>
            <Navbar />
            <main className={`app-content ${backgroundColor}`}>
                {children}
            </main>
        </>
        
    )
}