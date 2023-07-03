async function loadModals(client) {
  const { loadFiles } = require("../Functions/fileLoader");
  require('colors');

  await client.modals.clear();

  const Files = await loadFiles("Modals");

  Files.forEach((file) => {
    const modal = require(file);
    client.modals.set(modal.data.name, modal);
  });

  return console.log(`[SISTEMA] :: Modals Cargado.`.bgRed);
}

module.exports = { loadModals };
