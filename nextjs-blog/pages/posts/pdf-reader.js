import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

import Link from 'next/link';
import Head from 'next/head';
import Script from "next/script";

import Layout from "../../components/layout/layout";

export default function PdfReader() {
    const [pdfFileData, setPdfFileData] = useState();
    const [extractPages, setExtractPages] = useState(['', '']);
    
    function readFileAsync(file) {
        return new Promise((resolve, reject) => {
            // creating file reader, setting the result to be array buffer,
            // upon successful file read we resolve promise with result
            // else reject on file read error
            let reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
        });
    }
    function renderPdf(uint8array) {
        // setting src to pdf iframe to render loaded document
        const tempBlob = new Blob([uint8array], {
            type: "application/pdf",
        });
        const docUrl = URL.createObjectURL(tempBlob);
        setPdfFileData(docUrl);
    }
    function range(start, end) {
        // creating the array of page indexes that must be rendered
        let length = end - start + 1;
        return Array.from({ length }, (_, i) => start + i - 1);
    }
    async function extractPdfPage(arrayBuff, pagesArray = null) {
        // reading original document, creating new object,
        // copy either selected pages or all from original document
        // and return new copied object
        const pdfSrcDoc = await PDFDocument.load(arrayBuff);
        const pdfNewDoc = await PDFDocument.create();
        if (pagesArray) {
            const pages = await pdfNewDoc.copyPages(pdfSrcDoc, range(Number(pagesArray[0]), Number(pagesArray[1])));
            pages.forEach((page) => pdfNewDoc.addPage(page));
        } else {
            const pages = await pdfNewDoc.copyPages(pdfSrcDoc, range(1, pdfSrcDoc.getPages().length));
            pages.forEach((page) => pdfNewDoc.addPage(page));
        }
        return await pdfNewDoc.save();
    }
    async function onFileSelected(e) {
        // selecting file from input, getting array buffer,
        // creating new pdf document object and render it
        const fileList = e.target.files;
        if (fileList?.length > 0) {
            const pdfArrayBuffer = await readFileAsync(fileList[0]);
            const newPdfDoc = await extractPdfPage(pdfArrayBuffer);
            renderPdf(newPdfDoc);
        }
    };
    async function handleExtractPages() {
        // event handler upon page extract
        const fileList = document.getElementById('file-selector').files;
        if (fileList?.length > 0) {
            const pdfArrayBuffer = await readFileAsync(fileList[0]);
            const newPdfDoc = await extractPdfPage(pdfArrayBuffer, extractPages);
            renderPdf(newPdfDoc);
        }
    }
    
    return (
    <Layout>
        <Head>
            <title>PDF Reader</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
                  rel="stylesheet"
                  integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor"
                  crossOrigin="anonymous"/>
        </Head>
    
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2"
                crossOrigin="anonymous"
                onLoad={() => console.log('Bootstrap has been loaded successfully')}/>
        <div>
            <div className="page-title div-margin">PDF Reader</div>
            <div className="div-margin">
                <Link href='/'>
                    <a>
                        <button>
                            <span>&lt;- Back to main</span>
                        </button>
                    </a>
                </Link>
            </div>
            
            <div className="div-margin">
                <div>Load PDF file here</div>
                <div>
                    <input type="file"
                           id="file-selector"
                           accept="application/pdf"
                           onChange={onFileSelected}/>
                    <span>Extract pages</span>
                    <input className="input-extract"
                           onChange={(event) => setExtractPages(prev => [event.target.value, prev[1]])}/>
                    <input className="input-extract"
                           onChange={(event) => setExtractPages(prev => [prev[0], event.target.value])}/>
                    <button type="button"
                            onClick={handleExtractPages}>
                        <span>Extract</span>
                    </button>
                </div>
            </div>
        </div>
        
        <div>
            <iframe className="pdf-frame"
                    title="PdfFrame"
                    src={pdfFileData}
                    type="application/pdf">
            </iframe>
        </div>
        
        <style jsx>{`
            .page-title {
                font-size: 24px;
                font-weight: 600;
            }
            
            .div-margin {
                margin-top: 8px;
                margin-bottom: 8px;
            }
            
            .pdf-frame {
                display: block;
                width: 100%;
                height: 98vh;
                border: 0;
            }
            
            .input-extract {
                width: 50px;
                text-align: right;
            }
        `}</style>
    </Layout>
    )
}