//Sign up handler
document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const username = event.target.username.value;
    const password = event.target.password.value;
    
    const response = await fetch(`http://localhost:3001/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
  
    const data = await response.json();
    if (response.ok) {
      window.location.href = 'login.html'
    } else {
      alert(data.error);
    }
  });
  