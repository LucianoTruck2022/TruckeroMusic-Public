async function loadShemas(client) {
  const { loadFiles } = require("../Functions/fileLoader");
  require('colors');

  await client.shemas.clear();

  const Files = await loadFiles("Shemas");

  Files.forEach((file) => {
    const shema = require(file);
    client.shemas.set(shema.data.name, shema);
  });

  return console.log(`[SISTEMA] :: Shemas Cargado.`.bgRed);
}

module.exports = { loadShemas };
