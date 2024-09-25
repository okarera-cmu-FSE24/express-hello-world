//Login handler
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const username = event.target.username.value;
    const password = event.target.password.value;
  
    const response = await fetch(`http://localhost:3001/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });
  
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('username', data.username);
      window.location.href = "chatroom.html"
    } else {
      alert(data.error);
    }
  });
  