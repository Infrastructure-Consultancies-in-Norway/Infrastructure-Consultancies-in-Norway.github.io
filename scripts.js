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

document.addEventListener('DOMContentLoaded', function() {
    fetch('nav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('nav-placeholder').innerHTML = data;

            // Add event listeners for nav items after content is loaded
            let snacksLink = document.getElementById('snacks-link');
            if (snacksLink) {
                let clickTimeout = null;

                snacksLink.addEventListener('click', function(event) {
                    console.log('Single click detected');
                    event.preventDefault();

                    if (clickTimeout) {
                        clearTimeout(clickTimeout);
                        clickTimeout = null;
                    }

                    clickTimeout = setTimeout(function() {
                        console.log('Single click processed and prevented default');
                    }, 300); // 300ms delay to detect double click
                });

                snacksLink.addEventListener('dblclick', function(event) {
                    console.log('Double click detected');
                    clearTimeout(clickTimeout);
                    clickTimeout = null;

                    event.preventDefault(); // Prevent the default anchor behavior
                    alert("You've unlocked an easter egg!");
                    window.location.href = 'easter_egg.html';
                });
            } else {
                console.log('snacks-link element not found');
            }
        })
        .catch(error => console.error('Error loading nav:', error));

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});

// No additional code needed - footer loading is already handled in the DOMContentLoaded event listener above
