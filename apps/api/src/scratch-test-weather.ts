import axios from "axios";

async function test() {
  const key = "9f3f2534781b350f5f72de1db7890369";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Kadapa&appid=${key}&units=metric`;

  try {
    console.log("Fetching weather from OpenWeatherMap...");
    const res = await axios.get(url);
    console.log("SUCCESS:", JSON.stringify(res.data, null, 2));
  } catch (error: any) {
    console.error("FAILED:", error.message, error.response?.data);
  }
}

test();
