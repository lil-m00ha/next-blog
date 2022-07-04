import Image from 'next/image';
import Head from "next/head";
import Script from "next/script";

export default function BirdPortal() {
    return (
        <>
            <Head>
                <title>Bird portal</title>
            </Head>
            
            <div className="title-container">
                <div className="title-image">
                    <Image src="/images/parrot.jpg"
                           layout={'fill'}
                           objectFit={'contain'}
                           alt="Rosy-faced Lovebird"/>
                </div>
                <h3 className="title-header">Welcome to Bird Portal!</h3>
            </div>
            
            <style jsx global>{`
                .title-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .title-header {
                    font-family: cursive;
                }
                .title-image {
                    position: relative;
                    width: 150px;
                    height: 150px;
                }
            `}</style>
        </>
    )
}