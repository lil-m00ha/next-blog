const { PDFDocument, StandardFonts } = PDFLib;

function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        }
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    })
}

function renderPdf(uint8array) {
    const tempBlob = new Blob([uint8array], {
        type: 'application/pdf',
    });
    document.getElementById('pdf-iframe').src = URL.createObjectURL(tempBlob);
}

function range(start, end) {
    let length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i - 1);
}

async function extractPdfPage(arrayBuff) {
    const pdfSrcDoc = await PDFDocument.load(arrayBuff);
    const pdfNewDoc = await PDFDocument.create();
    const pages = await pdfNewDoc.copyPages(pdfSrcDoc, range(1, pdfSrcDoc.getPages().length));
    pages.forEach((page) => pdfNewDoc.addPage(page));
    const newpdf = await pdfNewDoc.save();
    return newpdf;
}

const onFileSelected = async (e) => {
    const fileList = e.target.files;
    if (fileList?.length > 0) {
        const pdfArrayBuffer = await readFileAsync(fileList[0]);
        const newPdfDoc = await extractPdfPage(pdfArrayBuffer);
        renderPdf(newPdfDoc);
    }
};

document.getElementById('file-selector').addEventListener('change', onFileSelected)
