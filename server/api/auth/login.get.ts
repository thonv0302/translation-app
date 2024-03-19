export default defineEventHandler(async (event) => {
  console.log(event.context.db);

  return '111';
});
