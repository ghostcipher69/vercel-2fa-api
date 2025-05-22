import axios from "axios";

export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: "Key missing" });
  }

  try {
    const response = await axios.post(
      "https://2fa-auth.com/wp-admin/admin-ajax.php",
      new URLSearchParams({ action: "isures_2fa", key }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    const match = response.data.match(/value="(\d{6})"/);

    if (!match) {
      return res.status(500).json({ error: "Code not found" });
    }

    res.status(200).json({ code: match[1] });
  } catch (err) {
    res.status(500).json({ error: "Request failed", details: err.message });
  }
}
