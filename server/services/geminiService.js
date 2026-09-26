import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey && apiKey.trim() !== '') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('Failed to initialize GoogleGenerativeAI with provided key:', err.message);
  }
}

const SYSTEM_INSTRUCTION = `
You are the Play2Protect Anti-Doping & Sports Education AI Assistant.
Your mission is to provide clear, calm, objective educational information about anti-doping regulations, dietary supplements, prohibited substances, medications, and clean sports integrity.

CRITICAL SAFETY RULES:
1. You are strictly an EDUCATIONAL ASSISTANT. You are NOT a medical doctor, pharmacist, or legal counsel.
2. DO NOT diagnose medical conditions or interpret personal blood/urine test results.
3. DO NOT prescribe medications or instruct users to stop or alter doctor-prescribed treatments. Never tell someone to abruptly stop a drug if sudden cessation could cause dangerous medical withdrawal.
4. DO NOT recommend illegal substances or provide instructions on how to use, dose, cycle, or mask performance-enhancing drugs.
5. NEVER guarantee that any commercial dietary supplement is "100% safe" or "definitely clean", because supplements carry risks of cross-contamination and unlisted ingredients. Always advise checking for third-party batch testing (Informed Sport, NSF Certified for Sport, BSCG).
6. NEVER claim to replace official anti-doping bodies like WADA, NADA, USADA, or UKAD. Always remind users to verify substances on Global DRO (globaldro.com) or official national registries.
7. Always emphasize the core anti-doping principle of "Strict Liability" (the athlete is solely responsible for what enters their body).
8. CRAVING / TEMPTATION SUPPORT: When a user expresses acute cravings, strong urges, or temptations:
   - Provide immediate, compassionate, non-judgmental grounding.
   - Encourage a pause: 3 deep breaths, drinking a glass of cold water, stepping into a safer environment.
   - Direct them to Play2Protect's Craving Support page (/support-now) and the Professional Directory (/professionals).
9. EMERGENCY ESCALATION: If the user mentions overdose, difficulty breathing, chest pain, seizure, or thoughts of self-harm, immediately direct them to call local emergency services or go to the nearest emergency department.
10. DRUG REDUCTION & TAPERING PROHIBITION: If the user asks how to reduce/taper a drug or enters dosage reductions:
   - YOU MUST NOT calculate tapering schedules, percentage cuts, dosage plans, detox protocols, or replacement drugs.
   - Respond: "The safest reduction approach depends on the substance and your individual health, and some substances can cause serious withdrawal if stopped or changed suddenly. I can't create a personalized tapering schedule. A qualified healthcare professional can assess your situation and create an appropriate plan."
   - Provide direct links: Find Doctor / Find Counsellor (/professionals), Prepare for Appointment (/support-plan), and Healthy Daily Routine (/meal-planner).
11. Always include this standard reminder at the end: "Educational information only. Always verify current anti-doping information through official resources and qualified professionals."
`;

// Intelligent fallback knowledge engine for offline / unkeyed evaluation
const FALLBACK_KNOWLEDGE = [
  {
    keywords: ['how should i reduce', 'how to reduce', 'reduce this drug', 'taper', 'tapering', 'wean off', 'dosage reduction', 'detox schedule', 'stop taking'],
    response: `**The safest reduction approach depends on the substance and your individual health.**\n\nSome substances can cause serious, potentially life-threatening withdrawal effects if stopped or changed suddenly. Because of these physiological risks, **I cannot create an automated tapering schedule or calculate dosage reductions**.\n\nA qualified healthcare professional can safely assess your health history and create an appropriate, supervised plan.\n\n**Next Steps Available in Play2Protect:**\n1. **[Find a Doctor or Counsellor](/professionals)** — Connect with verified addiction specialists and sports medicine doctors.\n2. **[Prepare for Your Appointment](/support-plan)** — Write down questions and personal health notes with our Step-by-Step Support Plan.\n3. **[Follow a Healthy Daily Routine](/meal-planner)** — Focus on regular whole-food meals, hydration, and sleep while awaiting professional guidance.\n\n*Emergency Note: If you are experiencing severe withdrawal symptoms, chest pain, confusion, or breathing trouble, seek urgent medical emergency care immediately.*`
  },
  {
    keywords: ['right now', 'craving', 'feel like using', 'urge to use', 'temptation', 'tempted', 'feel like taking'],
    response: `**Take a Pause. You Are in Control of This Moment.**\n\nExperiencing a sudden urge or temptation is a natural biological reflex, but urges peak and subside like waves. Here is what you can do right now:\n\n1. **Pause for 2 Minutes:** Sit down, uncross your legs, and take 3 slow, deep belly breaths.\n2. **Ground Your Senses:** Drink a full glass of cold water. Notice the temperature and physical sensation.\n3. **Change Your Environment:** Step into another room, step outside for fresh air, or call someone you trust.\n4. **Try a Quick Distraction:** Head to our **[Craving & Temptation Support](/support-now)** for a 1-minute calming breathing drill or quick distraction exercise.\n5. **Speak with Someone:** If you need supportive guidance, browse our verified **[Professional Directory](/professionals)**.\n\n*Emergency Note: If you or someone around you is experiencing chest pain, difficulty breathing, or signs of overdose, contact emergency medical services immediately.*`
  },
  {
    keywords: ['emergency', 'overdose', 'chest pain', 'cannot breathe', 'suicide', 'self-harm'],
    response: `⚠️ **IMPORTANT EMERGENCY NOTICE**\n\nIf you are in immediate physical danger, experiencing severe chest pain, extreme shortness of breath, seizure symptoms, suspected overdose, or thoughts of self-harm, **please stop using this app and seek urgent medical help immediately**:\n\n* **Call your local Emergency Services** (e.g., 112 in India/EU, 911 in the US/Canada, 999 in the UK)\n* **Go to the nearest Hospital Emergency Department**\n* **Contact a verified crisis helpline or stay with a trusted friend/family member right now**\n\nPlay2Protect is an educational platform and cannot provide emergency medical intervention.`
  },
  {
    keywords: ['what is doping', 'define doping', 'meaning of doping', 'doping definition'],
    response: `**What is Doping?**\n\nUnder the World Anti-Doping Code, doping is defined as the occurrence of one or more Anti-Doping Rule Violations (ADRVs). While the presence of a prohibited substance in an athlete's bodily sample is the most well-known, violations also include:\n\n* **Presence** of a prohibited substance or its metabolites/markers\n* **Use or Attempted Use** of a prohibited substance or method\n* **Evading, Refusing, or Failing** to submit to sample collection\n* **Whereabouts Failures** (missing 3 tests or filings in 12 months)\n* **Tampering** with any part of the doping control process\n* **Possession or Trafficking** of prohibited substances\n* **Complicity or Prohibited Association**\n\n**Core Principle:** *Strict Liability* — Athletes are solely responsible for any substance found in their system, regardless of how it got there.`
  },
  {
    keywords: ['tue', 'therapeutic use', 'therapeutic use exemption', 'prescription exemption'],
    response: `**What is a Therapeutic Use Exemption (TUE)?**\n\nAthletes, like all individuals, may have illnesses or medical conditions (such as asthma, Type 1 diabetes, or severe allergies) requiring medications that happen to be on the WADA Prohibited List.\n\nA **Therapeutic Use Exemption (TUE)** allows an athlete to use a necessary prohibited medication without committing an anti-doping rule violation, under strict guidelines:\n\n1. The athlete would experience significant impairment to health if the medication were withheld.\n2. The therapeutic use will not produce significant performance enhancement beyond returning to normal health.\n3. No reasonable permitted alternative exists.\n4. The necessity is not a consequence of prior non-medical substance abuse.\n\n*Athletes must apply for and receive approval for a TUE before using the medication (except in documented medical emergencies).*`
  },
  {
    keywords: ['supplement', 'supplements risky', 'why supplements', 'contamination', 'safe supplement'],
    response: `**Why Can Supplements Be Risky?**\n\nDietary supplements present one of the highest risks for accidental doping violations among athletes for several reasons:\n\n1. **Food-Level Regulation:** In most countries, supplements are regulated as food products, not pharmaceutical drugs. Manufacturers do not have to prove efficacy or safety prior to sale.\n2. **Cross-Contamination:** Many manufacturing facilities process diverse powders on shared equipment, leading to trace contamination with banned steroids, SARMs, or stimulants.\n3. **Undeclared Ingredients:** Some products deliberately conceal potent or synthetic stimulants under proprietary names to make the product feel 'more effective'.\n4. **No Guarantee:** No supplement is guaranteed 100% risk-free.\n\n**Safer Approach:** If you choose to use supplements, look for independent third-party batch-tested seals such as **Informed Sport**, **NSF Certified for Sport**, or **BSCG**.`
  },
  {
    keywords: ['prohibited substance', 'banned substance', 'prohibited list', 'wada list'],
    response: `**What is a Prohibited Substance?**\n\nA prohibited substance is any drug or chemical compound identified on the annual **WADA Prohibited List**.\n\nTo be included on the list, a substance must satisfy at least **two of the following three criteria**:\n\n1. It has the potential to enhance or enhances sports performance.\n2. It represents an actual or potential health risk to the athlete.\n3. It violates the 'Spirit of Sport' (ethics, fair play, and health).\n\n**Classification Categories:**\n* **S0:** Non-approved substances\n* **S1:** Anabolic agents (steroids, SARMs)\n* **S2:** Peptide hormones & growth factors (EPO, GH)\n* **S3:** Beta-2 agonists (asthma inhalers)\n* **S4:** Hormone and metabolic modulators\n* **S5:** Diuretics and masking agents\n* **S6-S9:** Stimulants, narcotics, cannabinoids, and glucocorticoids (mostly in-competition)`
  },
  {
    keywords: ['creatine', 'creatine safe', 'creatine banned'],
    response: `**Is Creatine Prohibited in Sport?**\n\n* **Status:** Pure Creatine Monohydrate is **NOT prohibited** by WADA, NADA, or international sports federations. It is an amino acid compound naturally produced in the human liver and kidneys, and found in red meat and fish.\n* **Function:** It helps replenish cellular adenosine triphosphate (ATP) during short bursts of high-intensity muscular contraction.\n* **Caution for Athletes:** While pure creatine is permitted, athletes must be cautious of 'pre-workout' blends that combine creatine with unlisted stimulants. Always select certified single-ingredient creatine products tested by Informed Sport or NSF Certified for Sport.`
  },
  {
    keywords: ['cold', 'cough', 'pseudoephedrine', 'sudafed', 'fever'],
    response: `**Cold & Flu Medications in Sport:**\n\nEveryday over-the-counter cold and flu tablets are a major source of inadvertent doping positives.\n\n* **Pseudoephedrine & Ephedrine:** These common decongestants are **prohibited In-Competition** when urinary concentrations exceed specified thresholds (e.g., 150 µg/mL for pseudoephedrine). Therapeutic doses taken within 24 hours of an event can exceed this limit.\n* **Permitted Alternatives:** Standard paracetamol, ibuprofen, and saline nasal sprays are generally permitted. Always verify brand ingredients on Global DRO before competition.`
  },
  {
    keywords: ['safer choices', 'healthier decisions', 'clean sport', 'how to stay clean'],
    response: `**How to Make Safer & Healthier Choices in Sport:**\n\n1. **Food First:** Prioritize a nutrient-dense whole food diet, 7-9 hours of consistent sleep, and proper hydration before considering any supplements.\n2. **Check Before You Swallow:** Use **Global DRO (globaldro.com)** or your National Anti-Doping Agency's medicine checker before taking any medication.\n3. **Educate Your Doctors:** Always notify attending doctors, dentists, and pharmacists that you are a tested athlete subject to WADA anti-doping rules.\n4. **Demand Batch Testing:** If supplements are medically indicated, choose exclusively third-party certified products (Informed Sport / NSF Certified for Sport).\n5. **Keep Records:** Document all medications and supplements you take on your Doping Control Form during testing.`
  }
];

export async function generateChatResponse(userMessage, conversationHistory = []) {
  const disclaimer = "\n\n*Notice: Educational information only. Always verify current anti-doping information through official resources and qualified professionals.*";

  // Try real Gemini API if key is available
  if (apiKey && apiKey.trim() !== '') {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_INSTRUCTION
      });

      // Construct prompt with context
      const chat = model.startChat({
        history: conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
      });

      const result = await chat.sendMessage(userMessage);
      const text = result.response.text();
      return text.includes("Educational information only") ? text : text + disclaimer;
    } catch (err) {
      console.error('Gemini API Error, falling back to local engine:', err.message);
    }
  }

  // Local rule-based fallback response engine
  const query = (userMessage || '').toLowerCase();
  for (const item of FALLBACK_KNOWLEDGE) {
    if (item.keywords.some(kw => query.includes(kw))) {
      return item.response + disclaimer;
    }
  }

  // Contextual smart general response
  return `Thank you for asking about anti-doping and sports safety regarding "${userMessage.slice(0, 40)}...".

**Key Guidelines for Clean Sport:**
- **Strict Liability:** Under WADA rules, you are solely responsible for any substance found in your sample, whether ingested intentionally or inadvertently.
- **Check Every Ingredient:** Active pharmaceutical ingredients can be verified 24/7 on **Global DRO (globaldro.com)** or via your National Anti-Doping Agency (e.g. NADA).
- **Supplements:** Commercial supplements are not strictly pre-approved and can contain undeclared stimulants or anabolic compounds. Look for certified third-party testing (Informed Sport, NSF Certified for Sport, BSCG).
- **Need an Exemption?** If you have an approved medical condition requiring a prohibited medication, apply for a **Therapeutic Use Exemption (TUE)** with your sports doctor before competing.

Feel free to ask more specific questions about prohibited classes, cold medicines, TUE processes, or supplement safety!` + disclaimer;
}
