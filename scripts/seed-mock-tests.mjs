import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cmjbarwlzxalnzjoeosr.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MOCK_TESTS_CONFIG = [
  { code: 'P1', title: 'Mock Test 1 — Accounting',          paper_id: null },
  { code: 'P2', title: 'Mock Test 1 — Business Laws',       paper_id: null },
  { code: 'P3', title: 'Mock Test 1 — Maths & Statistics',  paper_id: null },
  { code: 'P4', title: 'Mock Test 1 — Business Economics',  paper_id: null },
];

const QUESTIONS_PER_TEST = 30;

async function main() {
  console.log('=== Seed Mock Tests ===\n');

  // 1. Fetch all 4 papers
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
  papers.forEach(p => { paperMap[p.code] = p.id; });

  for (const cfg of MOCK_TESTS_CONFIG) {
    cfg.paper_id = paperMap[cfg.code];
    if (!cfg.paper_id && cfg.paper_id !== 0) {
      console.error(`Paper ${cfg.code} not found in database!`);
      process.exit(1);
    }
  }

  // 2. Delete existing mock tests (cascade will delete mock_test_questions too)
  console.log('\nDeleting existing mock tests...');
  const { error: delErr } = await supabase
    .from('mock_tests')
    .delete()
    .gte('test_number', 0); // match all rows

  if (delErr) {
    console.error('Error deleting mock tests:', delErr);
    // Try alternative: delete where test_number = 1
    const { error: delErr2 } = await supabase
      .from('mock_tests')
      .delete()
      .eq('test_number', 1);
    if (delErr2) { console.error('Error deleting mock tests (attempt 2):', delErr2); process.exit(1); }
  }
  console.log('Deleted existing mock tests.');

  // 3. Create Mock Test 1 for each paper
  console.log('\nCreating mock tests...');
  const mockTestRows = MOCK_TESTS_CONFIG.map(cfg => ({
    paper_id:            cfg.paper_id,
    test_number:         1,
    title:               cfg.title,
    difficulty_label:    'warm-up',
    total_questions:     QUESTIONS_PER_TEST,
    duration_minutes:    60,
    total_marks:         100,
    negative_marking:    -0.25,
    passing_marks:       40,
    unlock_condition:    'always',
    is_active:           true,
    scheduled_release_date: null,
  }));

  const { data: mockTests, error: mtErr } = await supabase
    .from('mock_tests')
    .insert(mockTestRows)
    .select('id, paper_id, title');

  if (mtErr) {
    console.error('Error inserting mock tests:', mtErr);
    // If extra columns don't exist, retry with only schema columns
    console.log('Retrying with base schema columns only...');
    const baseRows = MOCK_TESTS_CONFIG.map(cfg => ({
      paper_id:            cfg.paper_id,
      test_number:         1,
      title:               cfg.title,
      difficulty_label:    'warm-up',
      unlock_condition:    'always',
      is_active:           true,
      scheduled_release_date: null,
    }));
    const { data: mockTests2, error: mtErr2 } = await supabase
      .from('mock_tests')
      .insert(baseRows)
      .select('id, paper_id, title');
    if (mtErr2) { console.error('Error inserting mock tests (retry):', mtErr2); process.exit(1); }
    await assignQuestions(mockTests2);
    return;
  }

  await assignQuestions(mockTests);
}

async function assignQuestions(mockTests) {
  console.log(`\nCreated ${mockTests.length} mock tests:`);
  mockTests.forEach(mt => console.log(`  ${mt.title} (id=${mt.id})`));

  // 4. For each mock test, fetch approved questions and assign
  console.log('\nAssigning questions to mock tests...');

  for (const mt of mockTests) {
    const { data: questions, error: qErr } = await supabase
      .from('questions')
      .select('id')
      .eq('paper_id', mt.paper_id)
      .eq('status', 'approved')
      .limit(QUESTIONS_PER_TEST);

    if (qErr) {
      console.error(`Error fetching questions for ${mt.title}:`, qErr);
      continue;
    }

    if (!questions || questions.length === 0) {
      console.warn(`  WARNING: No approved questions found for ${mt.title}`);
      continue;
    }

    const mtqRows = questions.map((q, idx) => ({
      mock_test_id:   mt.id,
      question_id:    q.id,
      question_order: idx + 1,
    }));

    const { error: mqErr } = await supabase
      .from('mock_test_questions')
      .insert(mtqRows);

    if (mqErr) {
      console.error(`Error inserting questions for ${mt.title}:`, mqErr);
    } else {
      console.log(`  ${mt.title}: assigned ${questions.length} questions`);
    }
  }

  // 5. Verify
  console.log('\n=== Verification ===');
  const { data: allMT } = await supabase
    .from('mock_tests')
    .select('id, title, paper_id')
    .order('paper_id');

  const { data: allMTQ } = await supabase
    .from('mock_test_questions')
    .select('mock_test_id');

  console.log(`Mock tests in DB: ${allMT?.length ?? 0}`);
  if (allMT) {
    for (const mt of allMT) {
      const count = allMTQ?.filter(q => q.mock_test_id === mt.id).length ?? 0;
      console.log(`  ${mt.title}: ${count} questions`);
    }
  }

  console.log('\nDone!');
}

main().catch(err => { console.error('Fatal error:', err); process.exit(1); });
