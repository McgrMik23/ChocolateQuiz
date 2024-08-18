function getResult() {
    const results = ['Milk Chocolate', 'Dark Chocolate', 'White Chocolate', 'Caramel Chocolate'];
    const randomIndex = Math.floor(Math.random() * results.length);
    const userResult = results[randomIndex];
    document.getElementById('result').innerText = `You are ${userResult}!`;

    // Send data to the backend
    fetch('http://localhost:3000/save-result', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ result: userResult }),
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('status').innerText = data;
    })
    .catch(error => {
        document.getElementById('status').innerText = 'Error: ' + error;
    });
}
