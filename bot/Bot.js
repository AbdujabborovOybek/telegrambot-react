const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const apiKey = process.env.API_KEY;
const axios = require("axios");
var fs = require("fs");

bot.on("message", async (msg) => {
  const userId = msg.from.id;
  const msgId = msg.message_id;
  const chatId = msg.chat.id;

  if (msg.text === "/start") {
    return bot.sendMessage(chatId, "Nimadur yozingdi!!!");
  }
  const response = await search(msg.text);

  if (response.status === "SUCCESS") {
    const audiourl = response.result.url;
    var file = fs.createWriteStream("file.wav");
    var request = https.get(audiourl, function (response) {
      response.pipe(file);
    });

    bot.sendAudio(chatId, "file.wav", {
      caption: "Audio",
      title: "Audio",
      performer: "Audio",
    });
  }
});

const search = async (search) => {
  return new Promise((resolve, reject) => {
    try {
      const option = {
        method: "post",
        url: "https://studio.mohir.ai/api/v1/tts",
        headers: {
          Authorization: [apiKey],
          "Content-type": "application/json",
        },
        data: {
          text: search,
          model: "dilfuza",
        },
      };

      axios(option)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};

// {
//   "id": "tts/d4225015-dd04-436b-979a-ef89e0a48a6c/be9e0475-2ef0-4c4f-8211-9bfbd54d2216",
//   "progress": 1,
//   "result": {
//     "url": "https://beta-studio.storage.googleapis.com/api_media/tts/d4225015-dd04-436b-979a-ef89e0a48a6c/be9e0475-2ef0-4c4f-8211-9bfbd54d2216.wav?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=studio-cluster-manager-117%40mohirdev-379005.iam.gserviceaccount.com%2F20230822%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230822T065603Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=2358ca0c0e54cfd1efab2c6477b69d64c9a8865bbfbeb686723de97f2923f09c3ea812a43d714fd0e22d306afe048f0cad8bcf84bf96e7fa63af5ea729187cc8bd8bbfeb6f3f55d260910f94f4348e47b97a11cf396f17161df4531919cf2adabbc077caf2657573abb94106d4d6e3cf002e16bdf1b21079a11eac6ce561fb66b5c90e4da858a217f3bbadb071b96c0bc12aa6531f871ff60b526134e07b2c8eae99745805832fe0a2126390092681c932da72caf5eb3b047f4100c57389fe01b0ca2007d734bd4e90c87493eb01a4808c4068bd4e5ff54e61a56794386a263437a161ecd0503c917195f37718b1c804f6016615ba0c4c4ea52092ac8392abf7"
//   },
//   "status": "SUCCESS"
// }
