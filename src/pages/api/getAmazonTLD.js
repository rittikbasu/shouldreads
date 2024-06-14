import axios from "axios";

export default async function handler(req, res) {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (ip === "::1" || ip === "127.0.0.1") {
      const tld = "in";
      return res.status(200).json({ tld });
    }

    const response = await axios.get(
      `https://ipinfo.io/${ip}/json?token=a4a3006b20e784`
    );
    const data = response.data;
    console.log("Geolocation data:", data);

    const country = data.country;
    console.log("Country code:", country);

    const amazonDomains = {
      AU: "com.au",
      BE: "com.be",
      BR: "com.br",
      CA: "ca",
      CN: "cn",
      EG: "eg",
      FR: "fr",
      DE: "de",
      IN: "in",
      IT: "it",
      JP: "co.jp",
      MX: "com.mx",
      NL: "nl",
      PL: "pl",
      SA: "sa",
      SG: "sg",
      ES: "es",
      SE: "se",
      TR: "com.tr",
      AE: "ae",
      UK: "co.uk",
      US: "com",
    };

    const tld = amazonDomains[country] || "com";

    res.status(200).json({ tld });
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
    res.status(500).json({ error: "Failed to fetch geolocation data" });
  }
}
