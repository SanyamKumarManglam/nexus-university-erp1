import { storageService } from '../services/storageService.js';
import { allocationService } from '../services/allocationService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('====================================================');
console.log('  NEXUS VERIFICATION TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
  }
}

// ----------------------------------------------------
// TEST 1: Translation Dictionaries Completeness & Integrity
// ----------------------------------------------------
console.log('--- 1. Translation System Tests ---');
const translationsDir = path.resolve(__dirname, '../translations');
const langs = ['en', 'hi', 'ta', 'te'];
const dictionaries = {};

for (const lang of langs) {
  const filePath = path.join(translationsDir, `${lang}.json`);
  assert(fs.existsSync(filePath), `Dictionary file exists: ${lang}.json`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  try {
    const json = JSON.parse(raw);
    dictionaries[lang] = json;
    assert(Object.keys(json).length > 50, `${lang}.json has >50 translation keys (found: ${Object.keys(json).length})`);
  } catch (e) {
    assert(false, `${lang}.json is valid JSON`);
  }
}

// Check key parity against English
const enKeys = Object.keys(dictionaries['en']);
for (const lang of ['hi', 'ta', 'te']) {
  const langKeys = new Set(Object.keys(dictionaries[lang] || {}));
  const missingKeys = enKeys.filter(k => !langKeys.has(k));
  assert(
    missingKeys.length === 0,
    `${lang}.json covers all keys in en.json (missing: ${missingKeys.length}${missingKeys.length > 0 ? ': ' + missingKeys.slice(0, 5).join(', ') : ''})`
  );
}

// ----------------------------------------------------
// TEST 2: Per-Faculty Manual Capacity Caps & Calculations
// ----------------------------------------------------
console.log('\n--- 2. Per-Faculty Capacity Caps & Workload Calculations ---');

// Mock localStorage for Node environment
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

// Set distinct custom caps for 3 faculty members
const facultyCapsMap = {
  'T001': 130, // Custom Cap 130
  'T002': 160, // Custom Cap 160
  'T003': 90   // Custom Cap 90 (Dr. Karthik Rao currently has ~116 advisees, so 90 is over-capacity!)
};

const advisors = allocationService.getAdvisors(facultyCapsMap, 120);

// Find T001
const t1 = advisors.find(a => a.id === 'T001');
assert(Boolean(t1), 'Advisor T001 exists');
assert(t1.capacity === 130, `T001 capacity cap is 130 (actual: ${t1.capacity})`);
assert(t1.isIndividualCustom === true, 'T001 marked as having individual custom cap');
const expectedRem1 = 130 - t1.students;
assert(t1.remainingCapacity === expectedRem1, `T001 remaining capacity calculation is Capacity (${130}) - Students (${t1.students}) = ${expectedRem1} (actual: ${t1.remainingCapacity})`);

// Find T002
const t2 = advisors.find(a => a.id === 'T002');
assert(Boolean(t2), 'Advisor T002 exists');
assert(t2.capacity === 160, `T002 capacity cap is 160 (actual: ${t2.capacity})`);
assert(t2.isIndividualCustom === true, 'T002 marked as having individual custom cap');
const expectedRem2 = 160 - t2.students;
assert(t2.remainingCapacity === expectedRem2, `T002 remaining capacity calculation is Capacity (${160}) - Students (${t2.students}) = ${expectedRem2} (actual: ${t2.remainingCapacity})`);

// Find T003
const t3 = advisors.find(a => a.id === 'T003');
assert(Boolean(t3), 'Advisor T003 exists');
assert(t3.capacity === 90, `T003 capacity cap is 90 (actual: ${t3.capacity})`);
assert(t3.isIndividualCustom === true, 'T003 marked as having individual custom cap');
const expectedRem3 = 90 - t3.students;
assert(t3.remainingCapacity === expectedRem3, `T003 remaining capacity is ${expectedRem3} (actual: ${t3.remainingCapacity})`);
assert(t3.isOverCapacity === (t3.students > 90), `T003 correctly detected as over-capacity when students (${t3.students}) > 90`);

// Check non-custom faculty uses default benchmark
const t4 = advisors.find(a => a.id === 'T004');
assert(Boolean(t4), 'Advisor T004 exists');
assert(t4.isIndividualCustom === false, 'T4 retains default benchmark');

// ----------------------------------------------------
// TEST 3: Smart Optimization with Individual Caps
// ----------------------------------------------------
console.log('\n--- 3. Workload Optimization with Independent Caps ---');
const optResult = allocationService.calculateOptimization(facultyCapsMap, 120);
assert(optResult.totalMoved >= 0, `Optimization ran successfully with ${optResult.totalMoved} advisees reassigned`);
assert(Array.isArray(optResult.advisors), 'Optimization returned advisor distribution');

// ----------------------------------------------------
// TEST 4: Workload Allocation & Cap Breach Detection
// ----------------------------------------------------
console.log('\n--- 4. Workload Allocation & Override Logic ---');
// Allocate to T002 with headroom
const alloc1 = allocationService.allocateWorkload('T002', 2, false);
assert(alloc1.success === true, 'Allocating within capacity succeeds');

// Allocate massive number to T001 that breaches cap without override
const allocFail = allocationService.allocateWorkload('T001', 500, false);
assert(allocFail.success === false, 'Allocating beyond capacity cap without override fails with warning');
assert(allocFail.isBreach === true, 'Breach flag is set');

// Allocate with explicit override enabled
const allocOverride = allocationService.allocateWorkload('T001', 500, true);
assert(allocOverride.success === true, 'Allocating with explicit override allowed succeeds');

console.log('\n====================================================');
console.log(`  TEST RESULTS: ${passedTests} / ${totalTests} PASSED`);
console.log('====================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
