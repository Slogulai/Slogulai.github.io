document.getElementById('download-button').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const dialogResult = confirm("This will download a copy of my resume. Are you sure?");

    if (dialogResult) {
        const fetchResponse = await fetch('../assets/Chris_Sloggett_Resume.pdf');
        const blob = await fetchResponse.blob();
        saveAs(blob, 'Chris_Sloggett_Resume.pdf');
    }
});