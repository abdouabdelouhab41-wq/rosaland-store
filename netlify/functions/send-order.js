
exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    const order = JSON.parse(event.body || "{}");

    const required = [
      "name",
      "phone",
      "wilaya",
      "address",
      "bouquet",
      "quantity"
    ];

    for (const field of required) {
      if (!order[field]) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "Missing " + field
          })
        };
      }
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;

    const chatId = "6228482821";

    if (!token) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Telegram token is not configured"
        })
      };
    }

    const message =
`🌷 NOUVELLE COMMANDE — ROSALAND 🌷

👤 Nom : ${order.name}
📞 Téléphone : ${order.phone}
📍 Wilaya : ${order.wilaya}
🏠 Adresse : ${order.address}
💐 Bouquet : ${order.bouquet}
🔢 Quantité : ${order.quantity}
📝 Remarque : ${order.note || "Aucune"}

📲 Appeler le client pour confirmer la commande.`;

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    const result = await response.json();

    if (!response.ok || !result.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "Telegram rejected the message"
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error"
      })
    };
  }
};
