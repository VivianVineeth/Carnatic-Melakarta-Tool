/**
 * Canonical list of the 72 Melakarta Ragas (Parent Scales) of Carnatic Music.
 * The list is ordered by Chakra (1-6 using M1, 7-12 using M2) and ensures
 * correct numbering, raga names, and swara (note) patterns.
 *
 * Swara Notation:
 * S = Shadjam (Fixed)
 * R1, R2, R3 = Shuddha, Chathushruti, Shatshruti Rishabham
 * G1, G2, G3 = Shuddha, Sadharana, Anthara Gandharam
 * M1, M2 = Shuddha, Prati Madhyamam
 * P = Panchamam (Fixed)
 * D1, D2, D3 = Shuddha, Chathushruti, Shatshruti Dhaivatam
 * N1, N2, N3 = Shuddha, Kaishiki, Kakali Nishadam
 * S' = Tara Sthayi Shadjam (Fixed)
 */

 export const melakartaData = [
  // ----------------------------------------------------------------------
  // 1. INDU CHAKRA (M1, R1/G1)
  // ----------------------------------------------------------------------
  { Number: 1, Name: "Kanakangi", Arohanam: ["S","R1","G1","M1","P","D1","N1","S'"], Avarohanam: ["S'","N1","D1","P","M1","G1","R1","S"] },
  { Number: 2, Name: "Ratnangi", Arohanam: ["S","R1","G1","M1","P","D1","N2","S'"], Avarohanam: ["S'","N2","D1","P","M1","G1","R1","S"] },
  { Number: 3, Name: "Ganamurti", Arohanam: ["S","R1","G1","M1","P","D1","N3","S'"], Avarohanam: ["S'","N3","D1","P","M1","G1","R1","S"] },
  { Number: 4, Name: "Vanaspati", Arohanam: ["S","R1","G1","M1","P","D2","N2","S'"], Avarohanam: ["S'","N2","D2","P","M1","G1","R1","S"] },
  { Number: 5, Name: "Manavati", Arohanam: ["S","R1","G1","M1","P","D2","N3","S'"], Avarohanam: ["S'","N3","D2","P","M1","G1","R1","S"] },
  { Number: 6, Name: "Tanarupi", Arohanam: ["S","R1","G1","M1","P","D3","N3","S'"], Avarohanam: ["S'","N3","D3","P","M1","G1","R1","S"] },

  // ----------------------------------------------------------------------
  // 2. NETRA CHAKRA (M1, R1/G2)
  // ----------------------------------------------------------------------
  { Number: 7, Name: "Senavati", Arohanam: ["S","R1","G2","M1","P","D1","N1","S'"], Avarohanam: ["S'","N1","D1","P","M1","G2","R1","S"] },
  { Number: 8, Name: "Hanumatodi", Arohanam: ["S","R1","G2","M1","P","D1","N2","S'"], Avarohanam: ["S'","N2","D1","P","M1","G2","R1","S"] },
  { Number: 9, Name: "Dhenuka", Arohanam: ["S","R1","G2","M1","P","D1","N3","S'"], Avarohanam: ["S'","N3","D1","P","M1","G2","R1","S"] },
  { Number: 10, Name: "Natakapriya", Arohanam: ["S","R1","G2","M1","P","D2","N2","S'"], Avarohanam: ["S'","N2","D2","P","M1","G2","R1","S"] },
  { Number: 11, Name: "Kokilapriya", Arohanam: ["S","R1","G2","M1","P","D2","N3","S'"], Avarohanam: ["S'","N3","D2","P","M1","G2","R1","S"] },
  { Number: 12, Name: "Rupavati", Arohanam: ["S","R1","G2","M1","P","D3","N3","S'"], Avarohanam: ["S'","N3","D3","P","M1","G2","R1","S"] },

  // ----------------------------------------------------------------------
  // 3. AGNI CHAKRA (M1, R1/G3)
  // ----------------------------------------------------------------------
  { Number: 13, Name: "Gayakapriya", Arohanam: ["S","R1","G3","M1","P","D1","N1","S'"], Avarohanam: ["S'","N1","D1","P","M1","G3","R1","S"] },
  { Number: 14, Name: "Vakulabharanam", Arohanam: ["S","R1","G3","M1","P","D1","N2","S'"], Avarohanam: ["S'","N2","D1","P","M1","G3","R1","S"] },
  { Number: 15, Name: "Mayamalavagowla", Arohanam: ["S","R1","G3","M1","P","D1","N3","S'"], Avarohanam: ["S'","N3","D1","P","M1","G3","R1","S"] },
  { Number: 16, Name: "Chakravakam", Arohanam: ["S","R1","G3","M1","P","D2","N2","S'"], Avarohanam: ["S'","N2","D2","P","M1","G3","R1","S"] },
  { Number: 17, Name: "Suryakantam", Arohanam: ["S","R1","G3","M1","P","D2","N3","S'"], Avarohanam: ["S'","N3","D2","P","M1","G3","R1","S"] },
  { Number: 18, Name: "Hatakambari", Arohanam: ["S","R1","G3","M1","P","D3","N3","S'"], Avarohanam: ["S'","N3","D3","P","M1","G3","R1","S"] },

  // ----------------------------------------------------------------------
  // 4. VEDA CHAKRA (M1, R2/G2)
  // ----------------------------------------------------------------------
  { Number: 19, Name: "Jhankaradhvani", Arohanam: ["S","R2","G2","M1","P","D1","N1","S'"], Avarohanam: ["S'","N1","D1","P","M1","G2","R2","S"] },
  { Number: 20, Name: "Natabhairavi", Arohanam: ["S","R2","G2","M1","P","D1","N2","S'"], Avarohanam: ["S'","N2","D1","P","M1","G2","R2","S"] },
  { Number: 21, Name: "Keeravani", Arohanam: ["S","R2","G2","M1","P","D1","N3","S'"], Avarohanam: ["S'","N3","D1","P","M1","G2","R2","S"] },
  { Number: 22, Name: "Kharaharapriya", Arohanam: ["S","R2","G2","M1","P","D2","N2","S'"], Avarohanam: ["S'","N2","D2","P","M1","G2","R2","S"] },
  { Number: 23, Name: "Gourimanohari", Arohanam: ["S","R2","G2","M1","P","D2","N3","S'"], Avarohanam: ["S'","N3","D2","P","M1","G2","R2","S"] },
  { Number: 24, Name: "Varunapriya", Arohanam: ["S","R2","G2","M1","P","D3","N3","S'"], Avarohanam: ["S'","N3","D3","P","M1","G2","R2","S"] },

  // ----------------------------------------------------------------------
  // 5. BANA CHAKRA (M1, R2/G3)
  // ----------------------------------------------------------------------
  { Number: 25, Name: "Mararanjani", Arohanam: ["S","R2","G3","M1","P","D1","N1","S'"], Avarohanam: ["S'","N1","D1","P","M1","G3","R2","S"] },
  { Number: 26, Name: "Charukesi", Arohanam: ["S","R2","G3","M1","P","D1","N2","S'"], Avarohanam: ["S'","N2","D1","P","M1","G3","R2","S"] },
  { Number: 27, Name: "Sarasangi", Arohanam: ["S","R2","G3","M1","P","D1","N3","S'"], Avarohanam: ["S'","N3","D1","P","M1","G3","R2","S"] },
  { Number: 28, Name: "Harikambhoji", Arohanam: ["S","R2","G3","M1","P","D2","N2","S'"], Avarohanam: ["S'","N2","D2","P","M1","G3","R2","S"] },
  { Number: 29, Name: "Dheerashankarabharanam", Arohanam: ["S","R2","G3","M1","P","D2","N3","S'"], Avarohanam: ["S'","N3","D2","P","M1","G3","R2","S"] },
  { Number: 30, Name: "Naganandini", Arohanam: ["S","R2","G3","M1","P","D3","N3","S'"], Avarohanam: ["S'","N3","D3","P","M1","G3","R2","S"] },

  // ----------------------------------------------------------------------
  // 6. RUTU CHAKRA (M1, R3/G3)
  // ----------------------------------------------------------------------
  { Number: 31, Name: "Yagapriya", Arohanam: ["S","R3","G3","M1","P","D1","N1","S'"], Avarohanam: ["S'","N1","D1","P","M1","G3","R3","S"] },
  { Number: 32, Name: "Ragavardhini", Arohanam: ["S","R3","G3","M1","P","D1","N2","S'"], Avarohanam: ["S'","N2","D1","P","M1","G3","R3","S"] },
  { Number: 33, Name: "Gangeyabhushani", Arohanam: ["S","R3","G3","M1","P","D1","N3","S'"], Avarohanam: ["S'","N3","D1","P","M1","G3","R3","S"] },
  { Number: 34, Name: "Vagadheeswari", Arohanam: ["S","R3","G3","M1","P","D2","N2","S'"], Avarohanam: ["S'","N2","D2","P","M1","G3","R3","S"] },
  { Number: 35, Name: "Shulini", Arohanam: ["S","R3","G3","M1","P","D2","N3","S'"], Avarohanam: ["S'","N3","D2","P","M1","G3","R3","S"] },
  { Number: 36, Name: "Chalanata", Arohanam: ["S","R3","G3","M1","P","D3","N3","S'"], Avarohanam: ["S'","N3","D3","P","M1","G3","R3","S"] },

  // ----------------------------------------------------------------------
  // ** M2 (Prati Madhyamam) Starts Here: Ragas 37 - 72 **
  // ----------------------------------------------------------------------

  // ----------------------------------------------------------------------
  // 7. RISHI CHAKRA (M2, R1/G1)
  // ----------------------------------------------------------------------
  { Number: 37, Name: "Salagam", Arohanam: ["S","R1","G1","M2","P","D1","N1","S'"], Avarohanam: ["S'","N1","D1","P","M2","G1","R1","S"] },
  { Number: 38, Name: "Jalarnavam", Arohanam: ["S","R1","G1","M2","P","D1","N2","S'"], Avarohanam: ["S'","N2","D1","P","M2","G1","R1","S"] },
  { Number: 39, Name: "Jhalavarali", Arohanam: ["S","R1","G1","M2","P","D1","N3","S'"], Avarohanam: ["S'","N3","D1","P","M2","G1","R1","S"] },
  { Number: 40, Name: "Navaneetam", Arohanam: ["S","R1","G1","M2","P","D2","N2","S'"], Avarohanam: ["S'","N2","D2","P","M2","G1","R1","S"] },
  { Number: 41, Name: "Pavani", Arohanam: ["S","R1","G1","M2","P","D2","N3","S'"], Avarohanam: ["S'","N3","D2","P","M2","G1","R1","S"] },
  { Number: 42, Name: "Raghupriya", Arohanam: ["S","R1","G1","M2","P","D3","N3","S'"], Avarohanam: ["S'","N3","D3","P","M2","G1","R1","S"] },

  // ----------------------------------------------------------------------
  // 8. VASU CHAKRA (M2, R1/G2)
  // ----------------------------------------------------------------------
  { Number: 43, Name: "Gavambodhi", Arohanam: ["S","R1","G2","M2","P","D1","N1","S'"], Avarohanam: ["S'","N1","D1","P","M2","G2","R1","S"] },
  { Number: 44, Name: "Bhavapriya", Arohanam: ["S","R1","G2","M2","P","D1","N2","S'"], Avarohanam: ["S'","N2","D1","P","M2","G2","R1","S"] },
  { Number: 45, Name: "Shubhapantuvarali", Arohanam: ["S","R1","G2","M2","P","D1","N3","S'"], Avarohanam: ["S'","N3","D1","P","M2","G2","R1","S"] },
  { Number: 46, Name: "Shadvidhamargini", Arohanam: ["S","R1","G2","M2","P","D2","N2","S'"], Avarohanam: ["S'","N2","D2","P","M2","G2","R1","S"] },
  { Number: 47, Name: "Suvarnangi", Arohanam: ["S","R1","G2","M2","P","D2","N3","S'"], Avarohanam: ["S'","N3","D2","P","M2","G2","R1","S"] },
  { Number: 48, Name: "Divyamani", Arohanam: ["S","R1","G2","M2","P","D3","N3","S'"], Avarohanam: ["S'","N3","D3","P","M2","G2","R1","S"] },

  // ----------------------------------------------------------------------
  // 9. BRAHMA CHAKRA (M2, R1/G3)
  // ----------------------------------------------------------------------
  { Number: 49, Name: "Dhavalambari", Arohanam: ["S","R1","G3","M2","P","D1","N1","S'"], Avarohanam: ["S'","N1","D1","P","M2","G3","R1","S"] },
  { Number: 50, Name: "Namanarayani", Arohanam: ["S","R1","G3","M2","P","D1","N2","S'"], Avarohanam: ["S'","N2","D1","P","M2","G3","R1","S"] },
  { Number: 51, Name: "Kamavardhini", Arohanam: ["S","R1","G3","M2","P","D1","N3","S'"], Avarohanam: ["S'","N3","D1","P","M2","G3","R1","S"] },
  { Number: 52, Name: "Ramapriya", Arohanam: ["S","R1","G3","M2","P","D2","N2","S'"], Avarohanam: ["S'","N2","D2","P","M2","G3","R1","S"] },
  { Number: 53, Name: "Gamanashrama", Arohanam: ["S","R1","G3","M2","P","D2","N3","S'"], Avarohanam: ["S'","N3","D2","P","M2","G3","R1","S"] },
  { Number: 54, Name: "Vishwambari", Arohanam: ["S","R1","G3","M2","P","D3","N3","S'"], Avarohanam: ["S'","N3","D3","P","M2","G3","R1","S"] },

  // ----------------------------------------------------------------------
  // 10. DISI CHAKRA (M2, R2/G2)
  // ----------------------------------------------------------------------
  { Number: 55, Name: "Shyamalangi", Arohanam: ["S","R2","G2","M2","P","D1","N1","S'"], Avarohanam: ["S'","N1","D1","P","M2","G2","R2","S"] }, // Corrected Name: Shyamapriya -> Shyamalangi
  { Number: 56, Name: "Shanmukhapriya", Arohanam: ["S","R2","G2","M2","P","D1","N2","S'"], Avarohanam: ["S'","N2","D1","P","M2","G2","R2","S"] },
  { Number: 57, Name: "Simhendramadhyamam", Arohanam: ["S","R2","G2","M2","P","D1","N3","S'"], Avarohanam: ["S'","N3","D1","P","M2","G2","R2","S"] },
  { Number: 58, Name: "Hemavati", Arohanam: ["S","R2","G2","M2","P","D2","N2","S'"], Avarohanam: ["S'","N2","D2","P","M2","G2","R2","S"] },
  { Number: 59, Name: "Dharmavati", Arohanam: ["S","R2","G2","M2","P","D2","N3","S'"], Avarohanam: ["S'","N3","D2","P","M2","G2","R2","S"] },
  { Number: 60, Name: "Neetimati", Arohanam: ["S","R2","G2","M2","P","D3","N3","S'"], Avarohanam: ["S'","N3","D3","P","M2","G2","R2","S"] },

  // ----------------------------------------------------------------------
  // 11. RUDRA CHAKRA (M2, R2/G3)
  // ----------------------------------------------------------------------
  { Number: 61, Name: "Kantamani", Arohanam: ["S","R2","G3","M2","P","D1","N1","S'"], Avarohanam: ["S'","N1","D1","P","M2","G3","R2","S"] },
  { Number: 62, Name: "Rishabhapriya", Arohanam: ["S","R2","G3","M2","P","D1","N2","S'"], Avarohanam: ["S'","N2","D1","P","M2","G3","R2","S"] },
  { Number: 63, Name: "Latangi", Arohanam: ["S","R2","G3","M2","P","D1","N3","S'"], Avarohanam: ["S'","N3","D1","P","M2","G3","R2","S"] },
  { Number: 64, Name: "Vachaspati", Arohanam: ["S","R2","G3","M2","P","D2","N2","S'"], Avarohanam: ["S'","N2","D2","P","M2","G3","R2","S"] },
  { Number: 65, Name: "Mechakalyani", Arohanam: ["S","R2","G3","M2","P","D2","N3","S'"], Avarohanam: ["S'","N3","D2","P","M2","G3","R2","S"] },
  { Number: 66, Name: "Chitrambari", Arohanam: ["S","R2","G3","M2","P","D3","N3","S'"], Avarohanam: ["S'","N3","D3","P","M2","G3","R2","S"] },

  // ----------------------------------------------------------------------
  // 12. ADITYA CHAKRA (M2, R3/G3)
  // ----------------------------------------------------------------------
  { Number: 67, Name: "Sucharitra", Arohanam: ["S","R3","G3","M2","P","D1","N1","S'"], Avarohanam: ["S'","N1","D1","P","M2","G3","R3","S"] },
  { Number: 68, Name: "Jyotiswarupini", Arohanam: ["S","R3","G3","M2","P","D1","N2","S'"], Avarohanam: ["S'","N2","D1","P","M2","G3","R3","S"] },
  { Number: 69, Name: "Dhatuvardhani", Arohanam: ["S","R3","G3","M2","P","D1","N3","S'"], Avarohanam: ["S'","N3","D1","P","M2","G3","R3","S"] }, // Corrected Name: Dhatuvardhini -> Dhatuvardhani
  { Number: 70, Name: "Nasikabhushani", Arohanam: ["S","R3","G3","M2","P","D2","N2","S'"], Avarohanam: ["S'","N2","D2","P","M2","G3","R3","S"] },
  { Number: 71, Name: "Kosalam", Arohanam: ["S","R3","G3","M2","P","D2","N3","S'"], Avarohanam: ["S'","N3","D2","P","M2","G3","R3","S"] },
  { Number: 72, Name: "Rasikapriya", Arohanam: ["S","R3","G3","M2","P","D3","N3","S'"], Avarohanam: ["S'","N3","D3","P","M2","G3","R3","S"] }
];
