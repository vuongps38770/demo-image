export const authMockApi = {
  login: async (username) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { username, token: 'mock-jwt-token' };
  }
};
