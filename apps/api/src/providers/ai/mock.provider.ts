import type { AIProvider, StreamChatInput } from "./ai-provider.interface.js";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const DEMO_NOTE: Record<string, string> = {
  te: "_(ఇది డెమో సమాధానం — నిజమైన AI సమాధానాల కోసం apps/api/.env లో OPENAI_API_KEY లేదా GEMINI_API_KEY ఇవ్వండి.)_",
  hi: "_(यह एक डेमो उत्तर है — वास्तविक AI उत्तरों के लिए apps/api/.env में OPENAI_API_KEY या GEMINI_API_KEY जोड़ें।)_",
  en: "_(Note: this is a demo response — connect an OPENAI_API_KEY or GEMINI_API_KEY in apps/api/.env to get real AI-generated answers.)_",
};

/** Dev fallback used when no OPENAI_API_KEY/GEMINI_API_KEY is configured. Builds a templated but profile-grounded reply so the chat UX still feels personalized end-to-end without any real LLM call. */
export class MockAIProvider implements AIProvider {
  async *streamChat({ messages, farmerContext, imageUrl, language }: StreamChatInput): AsyncIterable<string> {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const crop = farmerContext.mainCrops?.[0] ?? "your crop";
    const place = farmerContext.village ?? farmerContext.district ?? "your area";
    const lang = language ?? farmerContext.preferredLanguage ?? "en";
    const note = DEMO_NOTE[lang] ?? DEMO_NOTE.en;

    let body: string;

    if (imageUrl) {
      body =
        lang === "te"
          ? `ఫోటో పంపినందుకు ధన్యవాదాలు, ${farmerContext.name}! ${place} లోని మీ ${crop} పంటలో ఆకుల రంగు మార్పు మరియు మచ్చలను గమనించండి. కచ్చితమైన నిర్ధారణ కోసం **Crop Diagnosis** ఉపయోగించండి.`
          : lang === "hi"
            ? `फ़ोटो भेजने के लिए धन्यवाद, ${farmerContext.name}! ${place} में आपकी ${crop} फ़सल में पत्तियों का रंग और धब्बे देखें। सटीक निदान के लिए **Crop Diagnosis** का उपयोग करें।`
            : `Thanks for the photo, ${farmerContext.name}! Based on what I can see, keep an eye on leaf discoloration and spacing around your ${crop} in ${place}. For a precise diagnosis, try the **Crop Diagnosis** tool, or describe the symptoms here (leaf color, spots, wilting pattern) and I'll suggest next steps.`;
    } else {
      body =
        lang === "te"
          ? `నమస్కారం ${farmerContext.name}! "${lastUserMessage.slice(0, 120)}" గురించి — ${place} లోని మీ ${crop} పంటకు:\n\n1. నీరు పెట్టే ముందు నేల తేమను తప్పకుండా చూడండి\n2. ఉదయం పూట పురుగుల కదలికను గమనించండి\n3. పంట దశకు తగినట్టుగా ఎరువులు వేయండి`
          : lang === "hi"
            ? `नमस्ते ${farmerContext.name}! "${lastUserMessage.slice(0, 120)}" के बारे में — ${place} में आपकी ${crop} फ़सल के लिए:\n\n1. सिंचाई से पहले मिट्टी की नमी जाँचें\n2. सुबह के समय कीट गतिविधि देखें\n3. फ़सल की अवस्था के अनुसार उर्वरक दें`
            : `Hi ${farmerContext.name}! About "${lastUserMessage.slice(0, 120)}" — for ${crop} in ${place}:\n\n1. Check soil moisture before irrigating\n2. Watch for pest activity in the early morning\n3. Time fertilizer application to the current growth stage`;
    }

    const reply = `${body}\n\n${note}`;

    for (const word of reply.split(" ")) {
      await sleep(18);
      yield word + " ";
    }
  }
}
