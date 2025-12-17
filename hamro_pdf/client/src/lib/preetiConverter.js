
// Preeti to Unicode Mapping
const preetiToUnicodeMapping = {
    "s": "क", "v": "ख", "U": "ग", "{": "घ", "ª": "ङ",
    "R": "च", "5": "छ", "h": "ज", "´": "झ", "~": "ञ",
    "`": "ट", "7": "ठ", "8": "ड", "9": "ढ", "0": "ण",
    "t": "त", "y": "थ", "b": "द", "w": "ध", "g": "न",
    "k": "प", "km": "फ", "x": "फ", "a": "ब", "e": "भ", "d": "म",
    "o": "य", "/": "र", "n": "ल", "j": "व", "z": "श", "i": "ष", ";": "स", "x": "ह",
    "?": "क्ष", "q": "त्र", "¡": "ज्ञ",

    // Vowels and others
    "c": "अ", "cf": "आ", "O": "इ", "O{": "ई", "p": "उ", "pm": "ऊ", "P": "ए", "Ｐ": "ऐ", "cf]": "ओ", "cf}": "औ", "c+": "अं", "cM": "अः", "_": "्",
    "f": "ा", "l": "ि", "L": "ी", "u": "ु", "U": "ू", "^": "ृ", "]": "े", "}": "ै", "f]": "ो", "f}": "ौ", "M": "ः", "+": "ं", "e": "ँ",
    ".": "।", "\\": "?", "r": "्र", "-": "र",

    // Numbers
    "1": "१", "2": "२", "3": "३", "4": "४", "5": "५", "6": "६", "7": "७", "8": "८", "9": "९", "0": "०"
};

// Simplified Reverse Mapping for Unicode to Preeti
const unicodeToPreetiMapping = {};
for (let key in preetiToUnicodeMapping) {
    unicodeToPreetiMapping[preetiToUnicodeMapping[key]] = key;
}

// Special overrides for some characters that map to multiple keys or complex combinations
// This is a simplified version, real-world conversion is much more complex
// Adding some common missing mappings manually for better coverage
Object.assign(preetiToUnicodeMapping, {
    "1": "१", "2": "२", "3": "३", "4": "४", "5": "५", "6": "६", "7": "७", "8": "८", "9": "९", "0": "०",
    "c": "अ", "cf": "आ", "cf]": "ओ", "cf}": "औ",
    "km": "फ", "sf": "का", "Sf": "का", "s": "क", "S": "क",
    "v": "ख", "V": "ख", "u": "ग", "U": "ग", "{": "घ", "ª": "ङ",
    "R": "च", "8": "ड", "9": "ढ", "0": "ण", "t": "त", "y": "थ", "b": "द", "w": "ध", "g": "न",
    "k": "प", "x": "फ", "a": "ब", "e": "भ", "d": "म", "o": "य", "/": "र", "n": "ल", "j": "व", "z": "श", "i": "ष", ";": "स", "x": "ह",
    // Common symbols and ligatures
    "\\": "्", "|": "्र", "/": "र", "‘": "“", "’": "”", "–": "—", ".": "।", "?": "?", "%": "%", "(": "(", ")": ")", "+": "+",
    // Matras
    "f": "ा", "l": "ि", "L": "ी", "u": "ु", "Q": "ु", "O": "इ", "Î": "इ",
    // Add other necessary mappings here. A full robust mapping is quite large.
    // For this task, we will implementation a robust-enough dictionary based logic.
});

// Since Preeti text uses 'l' for 'chhoti i' which comes AFTER the consonant in Unicode but BEFORE in Preeti,
// we need special handling.
// e.g. Preeti: lk (l + k) -> Unicode: पि (p + i)

export const preetiToUnicode = (text) => {
    if (!text) return "";
    let converted = "";

    // Convert logic
    // We need to iterate and handle the special 'l' (chhoti i) case
    // In Preeti 'l' comes before the character, in Unicode 'i' matra comes after.

    let chars = text.split('');

    for (let i = 0; i < chars.length; i++) {
        let char = chars[i];
        let nextChar = chars[i + 1];

        // Handling 'l' (chhoti i) - in Preeti it's typed before the letter, in Unicode it's a matra after
        // Case: l + consonant -> consonant + i
        if (char === 'l') {
            // Look ahead to see what it is attached to.
            // This is tricky because it might be a complex character.
            // Simple approach: swap with next character if next character is a consonant
            if (nextChar && isConsonantPreeti(nextChar)) {
                // Swap and process nextChar first
                converted += mapChar(nextChar) + "ि";
                i++; // Skip next char
                continue;
            }
        }

        converted += mapChar(char);
    }

    return converted;
};


// Helper to map a single character
const mapChar = (c) => {
    // Check for complex combinations first if we were tokenizing, but here we do char by char
    // Checking direct mapping
    if (preetiToUnicodeMapping[c]) return preetiToUnicodeMapping[c];

    // Default fallthrough
    return c;
}

const isConsonantPreeti = (c) => {
    // List of preeti keys that result in consonants
    const consonants = "ksvU{ªR5h´~`7890tybwgkxe;zix?q¡";
    return consonants.includes(c);
}


// UNICODE TO PREETI
// This is the reverse. 'i' matra (ि) in Unicode comes after consonant, in Preeti 'l' comes before.
export const unicodeToPreeti = (text) => {
    if (!text) return "";
    let converted = "";
    let chars = text.split('');

    for (let i = 0; i < chars.length; i++) {
        let char = chars[i];
        let nextChar = chars[i + 1];

        // Check for Consonant + 'ि'
        // If current is consonant and next is 'ि'
        if (isConsonantUnicode(char) && nextChar === 'ि') {
            converted += "l" + mapCharReverse(char);
            i++; // skip matra
            continue;
        }

        converted += mapCharReverse(char);
    }
    return converted;
}


const mapCharReverse = (c) => {
    // For specific unicode chars, we might have multiple Preeti options. 
    // We try to pick best default.
    // Since we didn't build a full map above, let's manually define key ones or search.

    // We can pre-build a reverse map for O(1) access
    // Ideally we rely on a robust library, but for this task we implement the logic.

    // Let's rely on a comprehensive dictionary for better results.
    // For now using the simple reverse map generated + manual overrides.

    // Manual strict overrides for reverse
    const reverseOverrides = {
        "अ": "c", "आ": "cf", "इ": "O", "ई": "O{", "उ": "p", "ऊ": "pm", "ए": "P", "ऐ": "u]", "ओ": "cf]", "औ": "cf}", "अं": "c+", "अः": "cM",
        "क": "s", "ख": "v", "ग": "u", "घ": "{", "ङ": "ª",
        "च": "R", "छ": "5", "ज": "h", "झ": "´", "ञ": "~",
        "ट": "`", "ठ": "7", "ड": "8", "ढ": "9", "ण": "0",
        "त": "t", "थ": "y", "द": "b", "ध": "w", "न": "g",
        "प": "k", "फ": "x", "ब": "a", "भ": "e", "म": "d",
        "य": "o", "र": "/", "ल": "n", "व": "j", "श": "z", "ष": "i", "स": ";", "ह": "x",
        "क्ष": "?", "त्र": "q", "ज्ञ": "¡",
        "ा": "f", "ि": "l", "ी": "L", "ु": "u", "ू": "U", "ृ": "^", "े": "]", "ै": "}", "ो": "f]", "ौ": "f}", "ं": "+", "ँ": "e", "ः": "M", "्": "\\", "।": ".",
        "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9", "०": "0"
    };

    if (reverseOverrides[c]) return reverseOverrides[c];

    return c;
}

const isConsonantUnicode = (c) => {
    return "कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहक्षत्रज्ञ".includes(c);
}
