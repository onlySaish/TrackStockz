import axios from 'axios'

export function createUser(formData) {
  return axios.post('/api/v1/users/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    if (error) {
      throw new Error(error.response.data.message); // Extract backend error message
    } else {
      throw new Error('Something went wrong. Please try again.'); // Fallback error
    }
  });
}

export async function loginUser(loginInfo) {
  return axios.post('/api/v1/users/login', loginInfo, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    if (error) {
      throw new Error(error.response.data.message); // Extract backend error message
    } else {
      throw new Error('Something went wrong. Please try again.'); // Fallback error
    }
  });
}

export function checkAuth() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get('/api/v1/users/check');
      resolve({ data: response.data });
    } catch (error) {
      if (error.response) {
        reject(error.response.data.message || 'Authentication failed');
      } else if (error.request) {
        reject('No response from server. Please try again.');
      } else {
        reject('An error occurred while checking authentication.');
      }
    }
  });
}

export function signOut() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post('/api/v1/users/logout');
      resolve({ data: 'success' });
    } catch (error) {
      if (error.response) {
        reject(error.response.data.message || 'Logout failed');
      } else if (error.request) {
        reject('No response from server. Please try again.');
      } else {
        reject('An error occurred while logging out.');
      }
    }
  });
}
