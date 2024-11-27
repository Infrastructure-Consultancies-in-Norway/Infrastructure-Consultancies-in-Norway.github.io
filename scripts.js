function downloadFile(fileName) {
    const anchor = document.createElement('a');
    anchor.href = `files/${fileName}`;
    anchor.download = fileName;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

function downloadFileGitHub(fileUrl) {
    // For GitHub file URLs, convert to raw content URL
    if (fileUrl.includes('github.com') && fileUrl.includes('/blob/')) {
        fileUrl = fileUrl.replace('github.com', 'raw.githubusercontent.com')
                         .replace('/blob/', '/');
    }

    fetch(fileUrl)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            const fileName = fileUrl.split('/').pop();
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Download error:', error));
}

