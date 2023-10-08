// login.js
import axios from 'axios';

export async function login(useremail, password) {
  try {
    // Replace with your actual Django backend login URL
    const url = 'http://localhost:8000/login/';
    console.log(url);
    const response = await axios.post(url, { useremail, password }, { withCredentials: true });

    if (response.status === 200) {
      console.log('Login successful');
      return response.data.user_id;
      // You may want to do something upon successful login,
      // like redirecting to another page or storing the user data.
    }
  } catch (error) {
    console.error('An error occurred while trying to log in:', error);
  }
}
