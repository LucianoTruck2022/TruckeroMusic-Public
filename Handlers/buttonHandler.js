async function loadbButtons(client) {
  const { loadFiles } = require("../Functions/fileLoader");
  require('colors');

  await client.buttons.clear();

  const Files = await loadFiles("Buttons");

  Files.forEach((file) => {
    const button = require(file);
    client.buttons.set(button.data.name, button);
  });

  return console.log(`[SISTEMA] :: Buttones cargados`.blue);
}

module.exports = { loadbButtons };
