import axios from "axios";

async function test() {
  const key = "579b464db66ec23bdd000001360e960986744f1e7d168efe3320a1d2";
  const resourceId = "9ef84268-d588-4dc4-8a26-21b41d930eaa";
  
  const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${key}&format=json&limit=5`;

  try {
    console.log("Fetching:", url);
    const res = await axios.get(url);
    console.log("SUCCESS:", JSON.stringify(res.data, null, 2).slice(0, 1500));
  } catch (error: any) {
    console.error("FAILED:", error.message, error.response?.data);
  }
}

test();
