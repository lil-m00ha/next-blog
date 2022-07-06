import Image from 'next/image';
import Head from "next/head";

import { getSortedPostsData } from '../../lib/bird-portal/posts';

/*
* getStaticProps() function is used to pre-render component
* with external data passed via props
*/
export async function getStaticProps() {
    const allPostsData = getSortedPostsData();
    return {
        props: {
            allPostsData,
        },
    };
}

export default function BirdPortal({ allPostsData }) {
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
            
            <div className="posts-container">
                <h4>Posts</h4>
                {allPostsData.map(({id, title, date}) => (
                    <div>
                        <div>Topic: {title}</div>
                        <div>Post date: {date}</div>
                    </div>
                ))}
            </div>
            
            <style jsx global>{`
                body {
                    font-family: cursive;
                }
                .title-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .title-image {
                    position: relative;
                    width: 150px;
                    height: 150px;
                }
                .posts-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
            `}</style>
        </>
    )
}