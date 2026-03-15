import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cmjbarwlzxalnzjoeosr.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const QUESTIONS_PER_TEST = 30;
const TESTS_PER_PAPER = 10;

// Configuration for 10 tests per paper
const TEST_TIERS = [
  { test_number: 1,  difficulty_label: 'warm-up',   unlock_condition: 'always' },
  { test_number: 2,  difficulty_label: 'warm-up',   unlock_condition: 'always' },
  { test_number: 3,  difficulty_label: 'warm-up',   unlock_condition: 'always' },
  { test_number: 4,  difficulty_label: 'standard',  unlock_condition: 'after_mock_3' },
  { test_number: 5,  difficulty_label: 'standard',  unlock_condition: 'after_mock_3' },
  { test_number: 6,  difficulty_label: 'standard',  unlock_condition: 'after_mock_3' },
  { test_number: 7,  difficulty_label: 'exam-mode', unlock_condition: 'after_500_questions' },
  { test_number: 8,  difficulty_label: 'exam-mode', unlock_condition: 'after_500_questions' },
  { test_number: 9,  difficulty_label: 'exam-mode', unlock_condition: 'after_500_questions' },
  { test_number: 10, difficulty_label: 'exam-mode', unlock_condition: 'within_60_days' },
];

// Paper code to display name mapping
const PAPER_NAMES = {
  P1: 'Accounting',
  P2: 'Business Laws',
  P3: 'Maths & Statistics',
  P4: 'Business Economics',
};

/**
 * Shuffle an array in-place using Fisher-Yates algorithm.
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pick `count` random questions from `pool`.
 * If pool has fewer than `count`, reuse questions (with replacement) to fill.
 */
function pickQuestions(pool, count) {
  if (pool.length === 0) return [];
  if (pool.length >= count) {
    return shuffle([...pool]).slice(0, count);
  }
  // Not enough unique questions — use all, then fill with random repeats
  const result = [...pool];
  while (result.length < count) {
    result.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return shuffle(result);
}

async function main() {
  console.log('=== Seed Mock Tests (Full — 10 per paper) ===\n');

  // 1. Fetch all papers
  const { data: papers, error: papersErr } = await supabase
    .from('papers')
    .select('id, code, name')
    .order('sort_order');

  if (papersErr) { console.error('Error fetching papers:', papersErr); process.exit(1); }
  if (!papers || papers.length === 0) { console.error('No papers found!'); process.exit(1); }

  console.log(`Found ${papers.length} papers:`);
  papers.forEach(p => console.log(`  ${p.code}: ${p.name} (id=${p.id})`));

  // Map paper codes to IDs
  const paperMap = {};
  papers.forEach(p => { paperMap[p.code] = p; });

  // 2. Check existing mock tests
  console.log('\nChecking existing mock tests...');
  const { data: existingTests } = await supabase
    .from('mock_tests')
    .select('paper_id, test_number')
    .order('paper_id')
    .order('test_number');

  const existingSet = new Set(
    (existingTests || []).map(t => `${t.paper_id}_${t.test_number}`)
  );
  console.log(`Found ${existingSet.size} existing mock tests.`);

  // 3. Build mock test rows — only for tests that don't exist yet
  console.log('\nCreating missing mock tests...');
  const mockTestRows = [];

  for (const paper of papers) {
    const paperName = PAPER_NAMES[paper.code] || paper.name;
    for (const tier of TEST_TIERS) {
      const key = `${paper.id}_${tier.test_number}`;
      if (existingSet.has(key)) {
        console.log(`  Skipping ${paperName} Test ${tier.test_number} (already exists)`);
        continue;
      }
      const suffix = tier.test_number === 10 ? ' (Final Exam Simulation)' : '';
      mockTestRows.push({
        paper_id:               paper.id,
        test_number:            tier.test_number,
        title:                  `Mock Test ${tier.test_number} — ${paperName}${suffix}`,
        difficulty_label:       tier.difficulty_label,
        unlock_condition:       tier.unlock_condition,
        is_active:              true,
        scheduled_release_date: null,
      });
    }
  }

  if (mockTestRows.length === 0) {
    console.log('\nAll mock tests already exist! Fetching all for question assignment...');
    const { data: allExisting } = await supabase
      .from('mock_tests')
      .select('id, paper_id, title, test_number')
      .order('paper_id')
      .order('test_number');
    await assignQuestions(allExisting || [], papers);
    return;
  }

  console.log(`\nInserting ${mockTestRows.length} new mock tests...`);

  const { data: newTests, error: mtErr } = await supabase
    .from('mock_tests')
    .insert(mockTestRows)
    .select('id, paper_id, title, test_number');

  if (mtErr) {
    console.error('Error inserting mock tests:', mtErr);
    process.exit(1);
  }

  // Fetch ALL mock tests (existing + new) for question assignment
  const { data: allTests } = await supabase
    .from('mock_tests')
    .select('id, paper_id, title, test_number')
    .order('paper_id')
    .order('test_number');

  await assignQuestions(allTests || [], papers);
}

async function assignQuestions(mockTests, papers) {
  console.log(`\nCreated ${mockTests.length} mock tests.`);

  // 4. Fetch all approved questions per paper (one query per paper)
  console.log('\nFetching approved questions per paper...');
  const questionsByPaper = {};

  for (const paper of papers) {
    // Supabase returns max 1000 rows by default; paginate if needed
    let allQuestions = [];
    let from = 0;
    const pageSize = 1000;

    while (true) {
      const { data: batch, error: qErr } = await supabase
        .from('questions')
        .select('id')
        .eq('paper_id', paper.id)
        .eq('status', 'approved')
        .range(from, from + pageSize - 1);

      if (qErr) {
        console.error(`Error fetching questions for ${paper.code}:`, qErr);
        break;
      }

      if (!batch || batch.length === 0) break;
      allQuestions = allQuestions.concat(batch);
      if (batch.length < pageSize) break;
      from += pageSize;
    }

    questionsByPaper[paper.id] = allQuestions;
    console.log(`  ${paper.code}: ${allQuestions.length} approved questions available`);
  }

  // 5. Assign questions to each mock test
  console.log('\nAssigning questions to mock tests...');
  let totalAssigned = 0;

  // Check which tests already have questions
  const { data: existingMTQ } = await supabase
    .from('mock_test_questions')
    .select('mock_test_id');
  const testsWithQuestions = new Set((existingMTQ || []).map(q => q.mock_test_id));

  for (const mt of mockTests) {
    if (testsWithQuestions.has(mt.id)) {
      console.log(`  ${mt.title}: already has questions — skipping`);
      continue;
    }

    const pool = questionsByPaper[mt.paper_id] || [];

    if (pool.length === 0) {
      console.warn(`  WARNING: No approved questions for ${mt.title} — skipping`);
      continue;
    }

    const selected = pickQuestions(pool, QUESTIONS_PER_TEST);

    // De-duplicate question_id per mock test for question_order
    // (duplicates can exist if pool < QUESTIONS_PER_TEST, but each row needs unique mock_test_id+question_id)
    const seen = new Set();
    const uniqueSelected = selected.filter(q => {
      if (seen.has(q.id)) return false;
      seen.add(q.id);
      return true;
    });

    const mtqRows = uniqueSelected.map((q, idx) => ({
      mock_test_id:   mt.id,
      question_id:    q.id,
      question_order: idx + 1,
    }));

    const { error: mqErr } = await supabase
      .from('mock_test_questions')
      .insert(mtqRows);

    if (mqErr) {
      console.error(`  Error inserting questions for ${mt.title}:`, mqErr);
    } else {
      console.log(`  ${mt.title}: assigned ${mtqRows.length} questions${uniqueSelected.length < QUESTIONS_PER_TEST ? ` (only ${pool.length} unique available)` : ''}`);
      totalAssigned += mtqRows.length;
    }
  }

  // 6. Verify
  console.log('\n=== Verification ===');
  const { data: allMT } = await supabase
    .from('mock_tests')
    .select('id, title, paper_id, test_number, difficulty_label, unlock_condition')
    .order('paper_id')
    .order('test_number');

  const { data: allMTQ } = await supabase
    .from('mock_test_questions')
    .select('mock_test_id');

  console.log(`\nMock tests in DB: ${allMT?.length ?? 0}`);
  console.log(`Total question assignments: ${allMTQ?.length ?? 0}\n`);

  if (allMT) {
    let currentPaper = null;
    for (const mt of allMT) {
      if (mt.paper_id !== currentPaper) {
        currentPaper = mt.paper_id;
        console.log(`--- Paper ${mt.title.split('—')[1]?.trim().split(' (')[0] || mt.paper_id} ---`);
      }
      const count = allMTQ?.filter(q => q.mock_test_id === mt.id).length ?? 0;
      console.log(`  #${mt.test_number} ${mt.difficulty_label} [${mt.unlock_condition}]: ${count} questions`);
    }
  }

  console.log(`\nSummary: ${allMT?.length ?? 0} mock tests, ${allMTQ?.length ?? 0} question assignments.`);
  console.log('Done!');
}

main().catch(err => { console.error('Fatal error:', err); process.exit(1); });
