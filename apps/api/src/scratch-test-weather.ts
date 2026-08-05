import axios from "axios";

async function test() {
  const key = "6653e87c4e7640c99a8164843260508"; // Wait! The key they sent is: 6653e87c4e7640c99a8164843260508
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=Kadapa&days=5`;

  try {
    console.log("Fetching weather from WeatherAPI.com...");
    const res = await axios.get(url);
    console.log("SUCCESS:", JSON.stringify(res.data, null, 2).slice(0, 1500));
  } catch (error: any) {
    console.error("FAILED:", error.message, error.response?.data);
  }
}

test();
