// services/challenge.service.ts

function hexToBytes(hex: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return bytes;
}

function bytesToHex(bytes: number[]): string {
  return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

// AES S-Box
const SBOX = [
  99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,
  202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,
  183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,
  4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,
  9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,
  83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,
  208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,
  81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,
  205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,
  96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,
  224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,
  231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,
  186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,
  112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,
  225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,
  140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22,
];

const RCON = [
  0x8d,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36,
];

function subWord(w: number[]): number[] {
  return w.map(b => SBOX[b]);
}

function rotWord(w: number[]): number[] {
  return [w[1], w[2], w[3], w[0]];
}

function xorWords(a: number[], b: number[]): number[] {
  return a.map((v, i) => v ^ b[i]);
}

function keyExpansion(key: number[]): number[][] {
  const nk = key.length / 4;
  const nr = nk + 6;
  const w: number[][] = [];

  for (let i = 0; i < nk; i++) {
    w[i] = key.slice(i * 4, i * 4 + 4);
  }

  for (let i = nk; i < 4 * (nr + 1); i++) {
    let temp = w[i - 1].slice();
    if (i % nk === 0) {
      temp = xorWords(subWord(rotWord(temp)), [RCON[i / nk], 0, 0, 0]);
    } else if (nk > 6 && i % nk === 4) {
      temp = subWord(temp);
    }
    w[i] = xorWords(w[i - nk], temp);
  }

  return w;
}

// GF(2^8) multiplication
function gmul(a: number, b: number): number {
  let p = 0;
  for (let i = 0; i < 8; i++) {
    if (b & 1) p ^= a;
    const hiBit = a & 0x80;
    a = (a << 1) & 0xff;
    if (hiBit) a ^= 0x1b;
    b >>= 1;
  }
  return p;
}

function addRoundKey(state: number[][], roundKey: number[][]): void {
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      state[r][c] ^= roundKey[c][r];
    }
  }
}

function invSubBytes(state: number[][]): void {
  const INV_SBOX = new Array(256);
  for (let i = 0; i < 256; i++) INV_SBOX[SBOX[i]] = i;
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      state[r][c] = INV_SBOX[state[r][c]];
}

function invShiftRows(state: number[][]): void {
  for (let r = 1; r < 4; r++) {
    const shift = 4 - r;
    state[r] = [...state[r].slice(shift), ...state[r].slice(0, shift)];
  }
}

function invMixColumns(state: number[][]): void {
  for (let c = 0; c < 4; c++) {
    const s = state.map(row => row[c]);
    state[0][c] = gmul(s[0],14) ^ gmul(s[1],11) ^ gmul(s[2],13) ^ gmul(s[3],9);
    state[1][c] = gmul(s[0],9)  ^ gmul(s[1],14) ^ gmul(s[2],11) ^ gmul(s[3],13);
    state[2][c] = gmul(s[0],13) ^ gmul(s[1],9)  ^ gmul(s[2],14) ^ gmul(s[3],11);
    state[3][c] = gmul(s[0],11) ^ gmul(s[1],13) ^ gmul(s[2],9)  ^ gmul(s[3],14);
  }
}

function aesDecryptBlock(block: number[], roundKeys: number[][]): number[] {
  const nr = roundKeys.length / 4 - 1;

  // Build state as 4x4 column-major
  const state: number[][] = [[],[],[],[]];
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      state[r][c] = block[c * 4 + r];

  const getRoundKey = (round: number) =>
    roundKeys.slice(round * 4, round * 4 + 4);

  addRoundKey(state, getRoundKey(nr));

  for (let round = nr - 1; round >= 1; round--) {
    invShiftRows(state);
    invSubBytes(state);
    addRoundKey(state, getRoundKey(round));
    invMixColumns(state);
  }

  invShiftRows(state);
  invSubBytes(state);
  addRoundKey(state, getRoundKey(0));

  const out: number[] = [];
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      out.push(state[r][c]);

  return out;
}

function aesCbcDecrypt(key: number[], iv: number[], ciphertext: number[]): number[] {
  const roundKeys = keyExpansion(key);
  const result: number[] = [];
  let prev = iv;

  for (let i = 0; i < ciphertext.length; i += 16) {
    const block = ciphertext.slice(i, i + 16);
    const dec = aesDecryptBlock(block, roundKeys);
    const plain = dec.map((b, j) => b ^ prev[j]);
    result.push(...plain);
    prev = block;
  }

  return result;
}

async function solveChallenge(html: string): Promise<string | null> {
  const match = html.match(
    /var a=toNumbers\("([a-f0-9]+)"\),b=toNumbers\("([a-f0-9]+)"\),c=toNumbers\("([a-f0-9]+)"\)/
  );

  if (!match) {
    console.error('[Challenge] Regex did not match. HTML snippet:', html.slice(0, 400));
    return null;
  }

  const key = hexToBytes(match[1]);
  const iv  = hexToBytes(match[2]);
  const enc = hexToBytes(match[3]);

  console.log('[Challenge] key:', match[1], 'iv:', match[2], 'enc:', match[3]);

  const decrypted = aesCbcDecrypt(key, iv, enc);
  return bytesToHex(decrypted);
}

export async function fetchWithChallenge(
  url: string,
  options: RequestInit
): Promise<Response> {
  const baseHeaders: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
  };

  const res1 = await fetch(url, { ...options, headers: baseHeaders });
  const text = await res1.text();

  if (!text.includes('slowAES.decrypt')) {
    return new Response(text, { status: res1.status, headers: res1.headers });
  }

  console.log('[Challenge] Detected, solving...');
  const testValue = await solveChallenge(text);
  if (!testValue) throw new Error('[Challenge] Failed to solve');

  console.log('[Challenge] Cookie value:', testValue);

  const res2 = await fetch(url, {
    ...options,
    headers: { ...baseHeaders, 'Cookie': `__test=${testValue}` },
  });

  const text2 = await res2.text();

  if (text2.includes('slowAES.decrypt')) {
    throw new Error('[Challenge] Server rejected cookie — may be IP-bound or session-bound');
  }

  return new Response(text2, { status: res2.status, headers: res2.headers });
}