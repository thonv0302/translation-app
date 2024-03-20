export const cachedGHStars = defineCachedFunction(async (repo: string) => {
  
}, {
  maxAge: 60 * 60,
  name: 'ghStars',
  getKey: (repo: string) => repo,
});
