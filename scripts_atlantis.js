// Auth0 Configuration
var auth0 = null;

async function configureClient() {
  auth0 = await createAuth0Client({
    domain: "dev-c3x7d417jhdtpgg1.us.auth0.com", // Replace with your Auth0 domain
    client_id: "vkcmDNuvOuWeGG5zYkeQa1wQnl4cagzp"   // Replace with your Auth0 client ID
  });
}

// Function to log in the user
async function login() {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin
  });
}

// Function to handle the authentication
async function handleAuthentication() {
  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    // User is authenticated, proceed to load your application
    console.log('User successfully logged in.');
    document.getElementById('app-content').style.display = 'block';
  } else {
    // User is not logged in, redirect to login page
    await login();
  }
}

// When the page loads
window.onload = async () => {
  await configureClient();
  await handleAuthentication();
};

async function handleAuthentication() {
    const isAuthenticated = await auth0.isAuthenticated();
  
    if (isAuthenticated) {
      document.getElementById('app-content').style.display = 'block';
      document.getElementById('login').style.display = 'none';
      document.getElementById('logout').style.display = 'block';
    } else {
      document.getElementById('app-content').style.display = 'none';
      document.getElementById('login').style.display = 'block';
      document.getElementById('logout').style.display = 'none';
      await login();
    }
  }
  

//* Program Script Begins *//
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('downloadChart').addEventListener('click', downloadChart);
    document.getElementById('savePlayer').addEventListener('click', savePlayerData);
    document.getElementById('playerList').addEventListener('change', loadPlayerData);

    // Define the levels
    const levels = ['Insufficient', 'Developing', 'Sufficient', 'Select', 'Elite'];

    // Function to update the displayed level for each slider
    function updateLevelDisplay(slider, displayElement) {
        const levelIndex = slider.value;
        displayElement.textContent = levels[levelIndex];
    }

    const ctx = document.getElementById('radarChart').getContext('2d');
    const data = {
        labels: ['Character', 'Pass-Catch', 'Carry (with the ball)', 'Lines of Running (Without the Ball)', 'Tackle-Contact Area', 'Game Sense'],
        datasets: [{
            label: 'Player Evaluation',
            data: [0, 0, 0, 0, 0, 0],
            fill: true,
            backgroundColor: 'rgba(51, 51, 51, 0.2)',
            borderColor: '#C8A563',
            pointBackgroundColor: '#C8A563',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#C8A563'
        }]
    };

    const config = {
        type: 'radar',
        data: data,
        options: {
            elements: { line: { borderWidth: 3 } },
            scales: {
                r: {
                    angleLines: { display: true },
                    suggestedMin: 0,
                    suggestedMax: 4, // Adjusted to match the new scale (0-4)
                    ticks: { display: false } // Hide ticks for a cleaner look
                }
            }
        }
    };

    const radarChart = new Chart(ctx, config);

    function updateChart() {
        const scores = [];
        document.querySelectorAll('.score-slider').forEach(slider => {
            const levelIndex = parseInt(slider.value);
            scores.push(levelIndex); // Push the index to the radar chart data array
            const displayElement = document.getElementById(`${slider.id}Value`);
            updateLevelDisplay(slider, displayElement);
        });
        radarChart.data.datasets[0].data = scores;
        radarChart.update();
    }

    document.querySelectorAll('.score-slider').forEach(slider => {
        slider.addEventListener('input', () => {
            updateChart();
            const displayElement = document.getElementById(slider.id + 'Value');
            updateLevelDisplay(slider, displayElement);
        });
    });

    function savePlayerData() {
        const playerName = document.getElementById('playerName').value;
        const evaluationDate = document.getElementById('evaluationDate').value;

        if (!playerName || !evaluationDate) {
            alert('Please enter a player name and select a date');
            return;
        }

        const scores = radarChart.data.datasets[0].data;
        const players = JSON.parse(localStorage.getItem('players')) || {};
        players[playerName] = { scores, evaluationDate };

        localStorage.setItem('players', JSON.stringify(players));
        loadPlayerList();
        showFeedbackMessage('Player data saved successfully.');
    }

    function loadPlayerData() {
        const playerName = document.getElementById('playerList').value;
        if (!playerName) {
            alert('Please select a player');
            return;
        }

        const players = JSON.parse(localStorage.getItem('players')) || {};
        if (players[playerName]) {
            radarChart.data.datasets[0].data = players[playerName].scores;
            radarChart.update();
            setSliderValues(players[playerName].scores);
            document.getElementById('evaluationDate').value = players[playerName].evaluationDate;
            showFeedbackMessage('Player data loaded successfully.');
        }
    }

    function setSliderValues(scores) {
        const sliderIds = ['character', 'passCatch', 'carry', 'linesOfRunning', 'tackleContact', 'gameSense'];
        sliderIds.forEach((id, index) => {
            const slider = document.getElementById(id);
            slider.value = scores[index];
            const displayElement = document.getElementById(id + 'Value');
            updateLevelDisplay(slider, displayElement);
        });
    }

    function loadPlayerList() {
        const players = JSON.parse(localStorage.getItem('players')) || {};
        const playerList = document.getElementById('playerList');
        playerList.innerHTML = '<option value="">Select a Player</option>';

        Object.keys(players).forEach(playerName => {
            const option = document.createElement('option');
            option.value = playerName;
            option.textContent = `${players[playerName].evaluationDate} - ${playerName}`;
            playerList.appendChild(option);
        });
    }

    function showFeedbackMessage(message) {
        const feedbackMessage = document.getElementById('feedbackMessage');
        feedbackMessage.textContent = message;
        setTimeout(() => feedbackMessage.textContent = '', 3000);
    }

    function downloadChart() {
        const playerName = document.getElementById('playerName').value.trim();
        const evaluationDate = document.getElementById('evaluationDate').value || 'MM/DD/YYYY';
        const levels = ['Insufficient', 'Developing', 'Sufficient', 'Select', 'Elite'];
        const data = {
            playerName: playerName,
            evaluationDate: evaluationDate,
            character: document.getElementById('character').value,
            passCatch: document.getElementById('passCatch').value,
            carry: document.getElementById('carry').value,
            linesOfRunning: document.getElementById('linesOfRunning').value,
            tackleContact: document.getElementById('tackleContact').value,
            gameSense: document.getElementById('gameSense').value,
            comments: document.getElementById('comments').value
        };
    
        const rightSection = document.querySelector('.right-section');
        const downloadButton = document.getElementById('downloadChart');
        const playerListDropdown = document.getElementById('playerList');
        const playerNameInput = document.getElementById('playerName');
        const evaluationDateInput = document.getElementById('evaluationDate');
        const commentsTextarea = document.getElementById('comments');
    
        downloadButton.style.display = 'none';
        playerListDropdown.style.display = 'none';
        playerNameInput.style.display = 'none';
        evaluationDateInput.style.display = 'none';
        commentsTextarea.style.display = 'none';
    
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'pt', 'a4');
    
        pdf.setFillColor(51, 51, 51);
        pdf.rect(0, 0, pdf.internal.pageSize.width, 60, 'F');
        pdf.setTextColor(200, 165, 99);
        pdf.setFont('Times', 'bold');
        pdf.setFontSize(24);
        const playerTitle = `${evaluationDate} - ${playerName}`;
        pdf.text(playerTitle, pdf.internal.pageSize.width / 2, 40, { align: 'center' });
    
        html2canvas(rightSection).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
    
            downloadButton.style.display = '';
            playerListDropdown.style.display = '';
            playerNameInput.style.display = '';
            evaluationDateInput.style.display = '';
            commentsTextarea.style.display = '';
    
            pdf.addImage(imgData, 'PNG', 80, 80, 400, 400);
    
            const sliderLabels = ['Character', 'Pass-Catch', 'Carry (with the ball)', 'Lines of Running', 'Tackle-Contact Area', 'Game Sense'];
            const sliderValues = [
                levels[document.getElementById('character').value],
                levels[document.getElementById('passCatch').value],
                levels[document.getElementById('carry').value],
                levels[document.getElementById('linesOfRunning').value],
                levels[document.getElementById('tackleContact').value],
                levels[document.getElementById('gameSense').value]
            ];
    
            pdf.setFont('Times', 'bold');
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
    
            const pageWidth = pdf.internal.pageSize.width; // Total width of the page
const blockWidth = 300; // Estimated block width (attributes + space + values)
const startX = (pageWidth - blockWidth) / 2; // Center align block
const attributesX = startX; // Attributes column
const valuesX = startX + 200; // Values column
const dividerX = startX + 150; // Divider position
let sliderYPosition = 500; // Starting position for attributes

pdf.setFont('Times', 'normal'); // Regular font for attributes
for (let i = 0; i < sliderLabels.length; i++) {
    // Draw attribute on the left
    pdf.text(sliderLabels[i], attributesX, sliderYPosition);

    // Draw vertical divider
    pdf.setDrawColor(0); // Black color for the divider line
    pdf.line(dividerX, sliderYPosition - 5, dividerX, sliderYPosition + 10);

    // Draw value on the right
    pdf.setFont('Times', 'bold'); // Bold font for values
    pdf.text(sliderValues[i], valuesX, sliderYPosition);

    // Reset font for next row
    pdf.setFont('Times', 'normal');

    // Draw full underline
    pdf.line(attributesX, sliderYPosition + 5, valuesX + 50, sliderYPosition + 5); // Full line underline

    sliderYPosition += 20; // Add spacing between rows
}
        
            
            pdf.setDrawColor(0);
            pdf.line(dividerX, 640, dividerX, sliderYPosition + 20);
    
            const commentsText = document.getElementById('comments').value;
            const commentsX = 40; // Adjusted to align with left margin
            const commentsY = sliderYPosition + 30; // Adjust based on attributes' end position
            pdf.text('Comments:', 40, commentsY); // Comment header
            pdf.setFont('Times', 'italic');
            pdf.setFontSize(12); // Maintain readable size for comments
            const wrappedComments = pdf.splitTextToSize(commentsText, pdf.internal.pageSize.width - 80); // Wrap text
            pdf.text(wrappedComments, 40, commentsY + 20);
    
            pdf.setFont('Times', 'italic');
            pdf.setFontSize(10);
            pdf.text('Powered by Give it a Try', 40, pdf.internal.pageSize.height - 40);
    
            pdf.save(`${playerTitle}-evaluation.pdf`);
        });
    
    }

    loadPlayerList();

    // Adding Security Features at the End of the File
document.addEventListener('contextmenu', function (e) {
    e.preventDefault(); // Disables right-click
});

document.addEventListener('keydown', function (e) {
    // Disable F12
    if (e.key === 'F12') {
        e.preventDefault();
    }

    // Disable Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
    }

    // Disable Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
    }

    // Disable Ctrl+U
    if (e.ctrlKey && e.key === 'U') {
        e.preventDefault();
    }

    // Disable Ctrl+C, Ctrl+X, Ctrl+V
    if (e.ctrlKey && (e.key === 'C' || e.key === 'X' || e.key === 'V')) {
        e.preventDefault();
    }
});

// Hide JavaScript from debugger
(function() {
    setInterval(function() {
        (function() {
            debugger; // Keeps bringing up the debugger, making it harder to inspect
        })();
    }, 100);
})();

});

// Function to log out the user
async function logout() {
    await auth0.logout({
      returnTo: window.location.origin
    });
  }