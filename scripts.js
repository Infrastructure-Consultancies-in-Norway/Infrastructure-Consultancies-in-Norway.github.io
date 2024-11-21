function downloadFile(fileName) {
    const anchor = document.createElement('a');
    anchor.href = `files/${fileName}`;
    anchor.download = fileName;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}