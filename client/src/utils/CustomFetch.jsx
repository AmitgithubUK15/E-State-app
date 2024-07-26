
export default async function CustomFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        credentials: 'include', 
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response;
}
