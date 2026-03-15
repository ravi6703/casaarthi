-- ============================================================
-- CA SAARTHI — CHAPTERS TABLE & EXPANDED TAXONOMY
-- Migration: 005_chapters_and_expanded_taxonomy.sql
-- Adds: Paper → Chapter → Topic → Sub-topic hierarchy
-- Based on ICAI CA Foundation complete syllabus structure
-- ============================================================

-- 1. Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paper_id      INT NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(paper_id, slug),
  UNIQUE(paper_id, chapter_number)
);

-- 2. Add chapter_id to topics
ALTER TABLE topics ADD COLUMN IF NOT EXISTS chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL;

-- 3. Enable RLS on chapters
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chapters_read" ON chapters FOR SELECT USING (true);

-- ============================================================
-- PAPER 1 CHAPTERS (11 chapters)
-- ============================================================
INSERT INTO chapters (id, paper_id, chapter_number, name, slug, sort_order) VALUES
  ('c1111111-0001-0001-0000-000000000001', 1, 1,  'Theoretical Framework',                    'theoretical-framework',      1),
  ('c1111111-0001-0002-0000-000000000001', 1, 2,  'Accounting Process',                       'accounting-process',         2),
  ('c1111111-0001-0003-0000-000000000001', 1, 3,  'Bank Reconciliation Statement',            'bank-reconciliation',        3),
  ('c1111111-0001-0004-0000-000000000001', 1, 4,  'Inventories',                              'inventories',                4),
  ('c1111111-0001-0005-0000-000000000001', 1, 5,  'Depreciation and Amortisation',            'depreciation-amortisation',  5),
  ('c1111111-0001-0006-0000-000000000001', 1, 6,  'Bills of Exchange and Promissory Notes',   'bills-of-exchange',          6),
  ('c1111111-0001-0007-0000-000000000001', 1, 7,  'Final Accounts of Sole Proprietors',       'final-accounts-sole',        7),
  ('c1111111-0001-0008-0000-000000000001', 1, 8,  'Financial Statements of Not-for-Profit Organizations', 'not-for-profit', 8),
  ('c1111111-0001-0009-0000-000000000001', 1, 9,  'Accounts from Incomplete Records',         'incomplete-records',         9),
  ('c1111111-0001-0010-0000-000000000001', 1, 10, 'Partnership and LLP Accounts',             'partnership-accounts',       10),
  ('c1111111-0001-0011-0000-000000000001', 1, 11, 'Company Accounts',                         'company-accounts',           11)
ON CONFLICT (paper_id, slug) DO NOTHING;

-- ============================================================
-- PAPER 2 CHAPTERS (7 chapters)
-- ============================================================
INSERT INTO chapters (id, paper_id, chapter_number, name, slug, sort_order) VALUES
  ('c1111111-0002-0001-0000-000000000001', 2, 1, 'Indian Regulatory Framework',       'regulatory-framework',       1),
  ('c1111111-0002-0002-0000-000000000001', 2, 2, 'The Indian Contract Act, 1872',     'indian-contract-act',        2),
  ('c1111111-0002-0003-0000-000000000001', 2, 3, 'The Sale of Goods Act, 1930',       'sale-of-goods-act',          3),
  ('c1111111-0002-0004-0000-000000000001', 2, 4, 'The Indian Partnership Act, 1932',  'indian-partnership-act',     4),
  ('c1111111-0002-0005-0000-000000000001', 2, 5, 'The Limited Liability Partnership Act, 2008', 'llp-act',          5),
  ('c1111111-0002-0006-0000-000000000001', 2, 6, 'The Companies Act, 2013',           'companies-act-2013',         6),
  ('c1111111-0002-0007-0000-000000000001', 2, 7, 'The Negotiable Instruments Act, 1881', 'negotiable-instruments-act', 7)
ON CONFLICT (paper_id, slug) DO NOTHING;

-- ============================================================
-- PAPER 3 CHAPTERS (16 chapters grouped by Part A/B/C)
-- ============================================================
INSERT INTO chapters (id, paper_id, chapter_number, name, slug, sort_order) VALUES
  -- Part A: Business Mathematics (40 marks)
  ('c1111111-0003-0001-0000-000000000001', 3, 1,  'Ratio and Proportion, Indices and Logarithms', 'ratio-proportion-indices-log', 1),
  ('c1111111-0003-0002-0000-000000000001', 3, 2,  'Equations',                                     'equations',                    2),
  ('c1111111-0003-0003-0000-000000000001', 3, 3,  'Linear Inequalities',                           'linear-inequalities',          3),
  ('c1111111-0003-0004-0000-000000000001', 3, 4,  'Mathematics of Finance',                        'mathematics-of-finance',       4),
  ('c1111111-0003-0005-0000-000000000001', 3, 5,  'Permutations and Combinations',                 'permutations-combinations',    5),
  ('c1111111-0003-0006-0000-000000000001', 3, 6,  'Sequence and Series',                           'sequence-series',              6),
  ('c1111111-0003-0007-0000-000000000001', 3, 7,  'Sets, Relations and Functions',                 'sets-relations-functions',     7),
  ('c1111111-0003-0008-0000-000000000001', 3, 8,  'Limits and Continuity',                         'limits-continuity',            8),
  ('c1111111-0003-0009-0000-000000000001', 3, 9,  'Differential and Integral Calculus',             'differential-integral-calc',   9),
  -- Part B: Logical Reasoning (20 marks)
  ('c1111111-0003-0010-0000-000000000001', 3, 10, 'Number Series, Coding-Decoding and Odd Man Out','number-series-coding',         10),
  ('c1111111-0003-0011-0000-000000000001', 3, 11, 'Direction Tests',                                'direction-tests',              11),
  ('c1111111-0003-0012-0000-000000000001', 3, 12, 'Seating Arrangements',                           'seating-arrangements',         12),
  ('c1111111-0003-0013-0000-000000000001', 3, 13, 'Blood Relations',                                'blood-relations-ch',           13),
  -- Part C: Statistics (40 marks)
  ('c1111111-0003-0014-0000-000000000001', 3, 14, 'Statistical Representation of Data',             'statistical-representation',   14),
  ('c1111111-0003-0015-0000-000000000001', 3, 15, 'Sampling',                                       'sampling',                     15),
  ('c1111111-0003-0016-0000-000000000001', 3, 16, 'Measures of Central Tendency and Dispersion',    'central-tendency-dispersion',  16),
  ('c1111111-0003-0017-0000-000000000001', 3, 17, 'Probability',                                    'probability',                  17),
  ('c1111111-0003-0018-0000-000000000001', 3, 18, 'Theoretical Distributions',                      'theoretical-distributions',    18),
  ('c1111111-0003-0019-0000-000000000001', 3, 19, 'Correlation and Regression',                     'correlation-regression-ch',    19),
  ('c1111111-0003-0020-0000-000000000001', 3, 20, 'Index Numbers',                                  'index-numbers',                20)
ON CONFLICT (paper_id, slug) DO NOTHING;

-- ============================================================
-- PAPER 4 CHAPTERS (10 chapters)
-- ============================================================
INSERT INTO chapters (id, paper_id, chapter_number, name, slug, sort_order) VALUES
  ('c1111111-0004-0001-0000-000000000001', 4, 1,  'Introduction to Business Economics',     'intro-economics',       1),
  ('c1111111-0004-0002-0000-000000000001', 4, 2,  'Theory of Demand and Supply',            'demand-supply',         2),
  ('c1111111-0004-0003-0000-000000000001', 4, 3,  'Theory of Production and Cost',          'production-cost',       3),
  ('c1111111-0004-0004-0000-000000000001', 4, 4,  'Price Determination in Different Markets','price-determination',  4),
  ('c1111111-0004-0005-0000-000000000001', 4, 5,  'Determination of National Income',       'national-income',       5),
  ('c1111111-0004-0006-0000-000000000001', 4, 6,  'Business Cycles',                        'business-cycles',       6),
  ('c1111111-0004-0007-0000-000000000001', 4, 7,  'Public Finance',                         'public-finance',        7),
  ('c1111111-0004-0008-0000-000000000001', 4, 8,  'Money Market',                           'money-market',          8),
  ('c1111111-0004-0009-0000-000000000001', 4, 9,  'International Trade',                    'international-trade',   9),
  ('c1111111-0004-0010-0000-000000000001', 4, 10, 'Indian Economy',                         'indian-economy',        10)
ON CONFLICT (paper_id, slug) DO NOTHING;

-- ============================================================
-- MAP EXISTING TOPICS TO CHAPTERS
-- ============================================================

-- Paper 1: Direct 1:1 mapping (existing topics = chapters)
UPDATE topics SET chapter_id = 'c1111111-0001-0001-0000-000000000001' WHERE id = '11111111-0001-0000-0000-000000000001';
UPDATE topics SET chapter_id = 'c1111111-0001-0002-0000-000000000001' WHERE id = '11111111-0001-0000-0000-000000000002';
UPDATE topics SET chapter_id = 'c1111111-0001-0003-0000-000000000001' WHERE id = '11111111-0001-0000-0000-000000000003';
UPDATE topics SET chapter_id = 'c1111111-0001-0004-0000-000000000001' WHERE id = '11111111-0001-0000-0000-000000000004';
UPDATE topics SET chapter_id = 'c1111111-0001-0005-0000-000000000001' WHERE id = '11111111-0001-0000-0000-000000000005';
UPDATE topics SET chapter_id = 'c1111111-0001-0006-0000-000000000001' WHERE id = '11111111-0001-0000-0000-000000000006';
UPDATE topics SET chapter_id = 'c1111111-0001-0007-0000-000000000001' WHERE id = '11111111-0001-0000-0000-000000000007';
UPDATE topics SET chapter_id = 'c1111111-0001-0008-0000-000000000001' WHERE id = '11111111-0001-0000-0000-000000000008';
UPDATE topics SET chapter_id = 'c1111111-0001-0009-0000-000000000001' WHERE id = '11111111-0001-0000-0000-000000000009';
UPDATE topics SET chapter_id = 'c1111111-0001-0010-0000-000000000001' WHERE id = '11111111-0001-0000-0000-000000000010';
UPDATE topics SET chapter_id = 'c1111111-0001-0011-0000-000000000001' WHERE id = '11111111-0001-0000-0000-000000000011';

-- Paper 2: Map topics to chapters (reorder to match docx)
UPDATE topics SET chapter_id = 'c1111111-0002-0001-0000-000000000001' WHERE id = '11111111-0002-0000-0000-000000000007'; -- Regulatory Framework → Ch1
UPDATE topics SET chapter_id = 'c1111111-0002-0002-0000-000000000001' WHERE id = '11111111-0002-0000-0000-000000000001'; -- Contract Act → Ch2
UPDATE topics SET chapter_id = 'c1111111-0002-0003-0000-000000000001' WHERE id = '11111111-0002-0000-0000-000000000002'; -- Sale of Goods → Ch3
UPDATE topics SET chapter_id = 'c1111111-0002-0004-0000-000000000001' WHERE id = '11111111-0002-0000-0000-000000000003'; -- Partnership → Ch4
UPDATE topics SET chapter_id = 'c1111111-0002-0005-0000-000000000001' WHERE id = '11111111-0002-0000-0000-000000000004'; -- LLP → Ch5
UPDATE topics SET chapter_id = 'c1111111-0002-0006-0000-000000000001' WHERE id = '11111111-0002-0000-0000-000000000005'; -- Companies → Ch6
UPDATE topics SET chapter_id = 'c1111111-0002-0007-0000-000000000001' WHERE id = '11111111-0002-0000-0000-000000000006'; -- Negotiable Instruments → Ch7

-- Paper 3: Map existing topics to chapters
UPDATE topics SET chapter_id = 'c1111111-0003-0001-0000-000000000001' WHERE id = '11111111-0003-0000-0000-000000000001'; -- Ratio
UPDATE topics SET chapter_id = 'c1111111-0003-0001-0000-000000000001' WHERE id = '11111111-0003-0000-0000-000000000002'; -- Logarithm → also Ch1
UPDATE topics SET chapter_id = 'c1111111-0003-0003-0000-000000000001' WHERE id = '11111111-0003-0000-0000-000000000003'; -- Linear Inequalities → Ch3
UPDATE topics SET chapter_id = 'c1111111-0003-0004-0000-000000000001' WHERE id = '11111111-0003-0000-0000-000000000004'; -- Time Value → Ch4
UPDATE topics SET chapter_id = 'c1111111-0003-0005-0000-000000000001' WHERE id = '11111111-0003-0000-0000-000000000005'; -- Permutations → Ch5
UPDATE topics SET chapter_id = 'c1111111-0003-0006-0000-000000000001' WHERE id = '11111111-0003-0000-0000-000000000006'; -- Sequence → Ch6
UPDATE topics SET chapter_id = 'c1111111-0003-0009-0000-000000000001' WHERE id = '11111111-0003-0000-0000-000000000007'; -- Calculus → Ch9
UPDATE topics SET chapter_id = 'c1111111-0003-0010-0000-000000000001' WHERE id = '11111111-0003-0000-0000-000000000008'; -- Logical Reasoning → Ch10
UPDATE topics SET chapter_id = 'c1111111-0003-0014-0000-000000000001' WHERE id = '11111111-0003-0000-0000-000000000009'; -- Statistical Description → Ch14
UPDATE topics SET chapter_id = 'c1111111-0003-0016-0000-000000000001' WHERE id = '11111111-0003-0000-0000-000000000010'; -- Central Tendency → Ch16
UPDATE topics SET chapter_id = 'c1111111-0003-0016-0000-000000000001' WHERE id = '11111111-0003-0000-0000-000000000011'; -- Dispersion → Ch16
UPDATE topics SET chapter_id = 'c1111111-0003-0019-0000-000000000001' WHERE id = '11111111-0003-0000-0000-000000000012'; -- Correlation → Ch19
UPDATE topics SET chapter_id = 'c1111111-0003-0020-0000-000000000001' WHERE id = '11111111-0003-0000-0000-000000000013'; -- Index Numbers → Ch20

-- Paper 4: Map existing topics to chapters
UPDATE topics SET chapter_id = 'c1111111-0004-0001-0000-000000000001' WHERE id = '11111111-0004-0000-0000-000000000001'; -- Intro → Ch1
UPDATE topics SET chapter_id = 'c1111111-0004-0002-0000-000000000001' WHERE id = '11111111-0004-0000-0000-000000000002'; -- Demand Supply → Ch2
UPDATE topics SET chapter_id = 'c1111111-0004-0003-0000-000000000001' WHERE id = '11111111-0004-0000-0000-000000000003'; -- Production → Ch3
UPDATE topics SET chapter_id = 'c1111111-0004-0004-0000-000000000001' WHERE id = '11111111-0004-0000-0000-000000000004'; -- Price → Ch4
UPDATE topics SET chapter_id = 'c1111111-0004-0006-0000-000000000001' WHERE id = '11111111-0004-0000-0000-000000000005'; -- Business Cycles → Ch6
UPDATE topics SET chapter_id = 'c1111111-0004-0010-0000-000000000001' WHERE id = '11111111-0004-0000-0000-000000000006'; -- Indian Economic → Ch10
UPDATE topics SET chapter_id = 'c1111111-0004-0004-0000-000000000001' WHERE id = '11111111-0004-0000-0000-000000000007'; -- Business Commercial → Ch4

-- ============================================================
-- ADD NEW TOPICS FOR CHAPTERS THAT DON'T HAVE EXISTING TOPICS
-- (Chapters from docx that are missing in current DB)
-- ============================================================

-- P3: Missing chapters need topics
INSERT INTO topics (id, paper_id, name, slug, exam_weightage, sort_order, chapter_id) VALUES
  -- Ch2: Equations
  ('11111111-0003-0000-0000-000000000020', 3, 'Equations', 'equations', 6, 14, 'c1111111-0003-0002-0000-000000000001'),
  -- Ch7: Sets Relations Functions
  ('11111111-0003-0000-0000-000000000021', 3, 'Sets, Relations and Functions', 'sets-relations-functions', 4, 15, 'c1111111-0003-0007-0000-000000000001'),
  -- Ch8: Limits and Continuity
  ('11111111-0003-0000-0000-000000000022', 3, 'Limits and Continuity', 'limits-continuity', 4, 16, 'c1111111-0003-0008-0000-000000000001'),
  -- Ch11: Direction Tests
  ('11111111-0003-0000-0000-000000000023', 3, 'Direction Tests', 'direction-tests', 3, 17, 'c1111111-0003-0011-0000-000000000001'),
  -- Ch12: Seating Arrangements
  ('11111111-0003-0000-0000-000000000024', 3, 'Seating Arrangements', 'seating-arrangements', 3, 18, 'c1111111-0003-0012-0000-000000000001'),
  -- Ch13: Blood Relations
  ('11111111-0003-0000-0000-000000000025', 3, 'Blood Relations', 'blood-relations-topic', 4, 19, 'c1111111-0003-0013-0000-000000000001'),
  -- Ch15: Sampling
  ('11111111-0003-0000-0000-000000000026', 3, 'Sampling', 'sampling-topic', 4, 20, 'c1111111-0003-0015-0000-000000000001'),
  -- Ch17: Probability
  ('11111111-0003-0000-0000-000000000027', 3, 'Probability', 'probability', 6, 21, 'c1111111-0003-0017-0000-000000000001'),
  -- Ch18: Theoretical Distributions
  ('11111111-0003-0000-0000-000000000028', 3, 'Theoretical Distributions', 'theoretical-distributions', 6, 22, 'c1111111-0003-0018-0000-000000000001')
ON CONFLICT (paper_id, slug) DO NOTHING;

-- P4: Missing chapters need topics
INSERT INTO topics (id, paper_id, name, slug, exam_weightage, sort_order, chapter_id) VALUES
  ('11111111-0004-0000-0000-000000000020', 4, 'Determination of National Income', 'national-income', 10, 8, 'c1111111-0004-0005-0000-000000000001'),
  ('11111111-0004-0000-0000-000000000021', 4, 'Public Finance', 'public-finance', 8, 9, 'c1111111-0004-0007-0000-000000000001'),
  ('11111111-0004-0000-0000-000000000022', 4, 'Money Market', 'money-market', 8, 10, 'c1111111-0004-0008-0000-000000000001'),
  ('11111111-0004-0000-0000-000000000023', 4, 'International Trade', 'international-trade', 10, 11, 'c1111111-0004-0009-0000-000000000001')
ON CONFLICT (paper_id, slug) DO NOTHING;

-- ============================================================
-- EXPANDED SUB-TOPICS FROM DOCX (Complete syllabus)
-- ============================================================

-- PAPER 1: Chapter 1 - Theoretical Framework (6 topics from docx)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0001-0000-0000-000000000001', 'Meaning and Scope of Accounting', 'meaning-scope-accounting', 4),
  ('11111111-0001-0000-0000-000000000001', 'Capital and Revenue Expenditure/Receipts', 'capital-revenue-expenditure', 5),
  ('11111111-0001-0000-0000-000000000001', 'Contingent Assets and Contingent Liabilities', 'contingent-assets-liabilities', 6),
  ('11111111-0001-0000-0000-000000000001', 'Accounting Policies', 'accounting-policies', 7),
  ('11111111-0001-0000-0000-000000000001', 'Accounting as a Measurement Discipline', 'measurement-discipline', 8)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Chapter 2 - Accounting Process (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0001-0000-0000-000000000002', 'Books of Original Entry', 'books-original-entry', 5),
  ('11111111-0001-0000-0000-000000000002', 'Cash Book', 'cash-book', 6),
  ('11111111-0001-0000-0000-000000000002', 'Rectification of Errors', 'rectification-errors', 7)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Chapter 3 - Bank Reconciliation (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0001-0000-0000-000000000003', 'Introduction to BRS', 'intro-brs', 4),
  ('11111111-0001-0000-0000-000000000003', 'Amended Cash Book', 'amended-cash-book', 5)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Chapter 4 - Inventories (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0001-0000-0000-000000000004', 'LIFO Method', 'lifo-method', 4),
  ('11111111-0001-0000-0000-000000000004', 'Perpetual vs Periodic Inventory System', 'perpetual-periodic', 5),
  ('11111111-0001-0000-0000-000000000004', 'Components of Cost', 'components-of-cost', 6)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Chapter 5 - Depreciation (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0001-0000-0000-000000000005', 'Sum of Years Digits Method', 'sum-years-digits', 4),
  ('11111111-0001-0000-0000-000000000005', 'Annuity Method', 'annuity-method', 5),
  ('11111111-0001-0000-0000-000000000005', 'Asset Disposal Account', 'asset-disposal', 6),
  ('11111111-0001-0000-0000-000000000005', 'Tangible vs Intangible Assets', 'tangible-intangible', 7)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Chapter 6 - Bills of Exchange (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0001-0000-0000-000000000006', 'Discounting and Endorsement', 'discounting-endorsement', 4),
  ('11111111-0001-0000-0000-000000000006', 'Noting and Protesting', 'noting-protesting', 5),
  ('11111111-0001-0000-0000-000000000006', 'Insolvency of Parties', 'insolvency-parties', 6)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Chapter 7 - Final Accounts (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0001-0000-0000-000000000007', 'Closing and Adjustment Entries', 'closing-adjustment', 5),
  ('11111111-0001-0000-0000-000000000007', 'Elements of Financial Statements', 'elements-financial', 6)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Chapter 8 - NPO (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0001-0000-0000-000000000008', 'Balance Sheet of NPO', 'npo-balance-sheet', 3),
  ('11111111-0001-0000-0000-000000000008', 'Subscriptions and Donations', 'subscriptions-donations', 4),
  ('11111111-0001-0000-0000-000000000008', 'Life Membership and Entrance Fees', 'life-membership', 5)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Chapter 9 - Incomplete Records (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0001-0000-0000-000000000009', 'Statement of Affairs Method', 'statement-affairs', 3),
  ('11111111-0001-0000-0000-000000000009', 'Total Debtors and Creditors Account', 'total-debtors-creditors', 4)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Chapter 10 - Partnership (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0001-0000-0000-000000000010', 'Final Accounts of Partnership', 'partnership-final-accounts', 5),
  ('11111111-0001-0000-0000-000000000010', 'Death of Partner', 'death-partner', 6),
  ('11111111-0001-0000-0000-000000000010', 'Piecemeal Distribution', 'piecemeal-distribution', 7)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Chapter 11 - Company Accounts (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0001-0000-0000-000000000011', 'Redemption of Preference Shares', 'redemption-pref-shares', 4),
  ('11111111-0001-0000-0000-000000000011', 'Redemption of Debentures', 'redemption-debentures', 5),
  ('11111111-0001-0000-0000-000000000011', 'Pro-rata Allotment', 'pro-rata-allotment', 6),
  ('11111111-0001-0000-0000-000000000011', 'Calls in Advance and Arrears', 'calls-advance-arrears', 7)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- PAPER 2: Expanded sub-topics
-- Chapter 1 - Regulatory Framework
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0002-0000-0000-000000000007', 'Ministry of Finance and MCA', 'mof-mca', 1),
  ('11111111-0002-0000-0000-000000000007', 'SEBI and RBI', 'sebi-rbi', 2),
  ('11111111-0002-0000-0000-000000000007', 'IBBI and Ministry of Law', 'ibbi-mol', 3)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Chapter 2 - Contract Act (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0002-0000-0000-000000000001', 'Contingent and Quasi Contracts', 'contingent-quasi', 8),
  ('11111111-0002-0000-0000-000000000001', 'Free Consent', 'free-consent', 9),
  ('11111111-0002-0000-0000-000000000001', 'Remedies for Breach', 'remedies-breach', 10)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Chapter 5 - LLP Act (new sub-topics)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0002-0000-0000-000000000004', 'Essential Features of LLP', 'essential-features-llp', 1),
  ('11111111-0002-0000-0000-000000000004', 'Incorporation of LLP', 'incorporation-llp', 2),
  ('11111111-0002-0000-0000-000000000004', 'Differences with Partnership and Company', 'llp-vs-partnership-company', 3)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Chapter 6 - Companies Act (new sub-topics)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0002-0000-0000-000000000005', 'Essential Features of Company', 'features-company', 1),
  ('11111111-0002-0000-0000-000000000005', 'Corporate Veil Theory', 'corporate-veil', 2),
  ('11111111-0002-0000-0000-000000000005', 'Classes and Types of Companies', 'classes-companies', 3),
  ('11111111-0002-0000-0000-000000000005', 'Incorporation and MOA/AOA', 'incorporation-moa-aoa', 4),
  ('11111111-0002-0000-0000-000000000005', 'Doctrine of Indoor Management', 'indoor-management', 5)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Chapter 7 - Negotiable Instruments (new sub-topics)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0002-0000-0000-000000000006', 'Types of Negotiable Instruments', 'types-ni', 1),
  ('11111111-0002-0000-0000-000000000006', 'Negotiation and Endorsement', 'negotiation-endorsement', 2),
  ('11111111-0002-0000-0000-000000000006', 'Presentment and Dishonour', 'presentment-dishonour', 3),
  ('11111111-0002-0000-0000-000000000006', 'Discharge and Compensation', 'discharge-compensation', 4)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- PAPER 3: Expanded sub-topics for new topics
-- Equations
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000020', 'Linear Equations', 'linear-equations', 1),
  ('11111111-0003-0000-0000-000000000020', 'Quadratic Equations', 'quadratic-equations', 2),
  ('11111111-0003-0000-0000-000000000020', 'Cubic Equations', 'cubic-equations', 3),
  ('11111111-0003-0000-0000-000000000020', 'Business Applications of Equations', 'business-app-equations', 4)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Ratio (existing topic, add sub-topics)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000001', 'Ratio and Proportion', 'ratio-proportion', 1),
  ('11111111-0003-0000-0000-000000000001', 'Indices and Surds', 'indices-surds', 2),
  ('11111111-0003-0000-0000-000000000001', 'Laws of Logarithms', 'laws-logarithms', 3)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Linear Inequalities (existing topic, add sub-topics)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000003', 'Inequalities in One Variable', 'one-variable-ineq', 1),
  ('11111111-0003-0000-0000-000000000003', 'Inequalities in Two Variables', 'two-variable-ineq', 2),
  ('11111111-0003-0000-0000-000000000003', 'Linear Programming Basics', 'linear-programming', 3)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Sets Relations Functions
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000021', 'Sets and Venn Diagrams', 'sets-venn', 1),
  ('11111111-0003-0000-0000-000000000021', 'Relations and Properties', 'relations-properties', 2),
  ('11111111-0003-0000-0000-000000000021', 'Functions - Types and Operations', 'functions-types', 3)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Limits and Continuity
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000022', 'Evaluation of Limits', 'evaluation-limits', 1),
  ('11111111-0003-0000-0000-000000000022', 'Indeterminate Forms', 'indeterminate-forms', 2),
  ('11111111-0003-0000-0000-000000000022', 'Continuity of Functions', 'continuity-functions', 3)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Calculus (existing topic, add sub-topics)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000007', 'Differentiation Rules', 'differentiation-rules', 1),
  ('11111111-0003-0000-0000-000000000007', 'Marginal Cost and Revenue', 'marginal-cost-revenue', 2),
  ('11111111-0003-0000-0000-000000000007', 'Maxima and Minima', 'maxima-minima', 3),
  ('11111111-0003-0000-0000-000000000007', 'Integration Methods', 'integration-methods', 4),
  ('11111111-0003-0000-0000-000000000007', 'Definite Integrals', 'definite-integrals', 5)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Sequence and Series (existing topic, add sub-topics)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000006', 'Arithmetic Progression', 'arithmetic-progression', 1),
  ('11111111-0003-0000-0000-000000000006', 'Geometric Progression', 'geometric-progression', 2),
  ('11111111-0003-0000-0000-000000000006', 'AM-GM Relationship', 'am-gm-relationship', 3)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Direction Tests
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000023', 'Basic and Ordinal Directions', 'basic-directions', 1),
  ('11111111-0003-0000-0000-000000000023', 'Direction Sense Problems', 'direction-problems', 2)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Seating Arrangements
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000024', 'Linear Arrangement', 'linear-arrangement', 1),
  ('11111111-0003-0000-0000-000000000024', 'Circular Arrangement', 'circular-arrangement', 2)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Blood Relations
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000025', 'Basic Blood Relations', 'basic-blood-relations', 1),
  ('11111111-0003-0000-0000-000000000025', 'Complex Coded Blood Relations', 'coded-blood-relations', 2)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Statistical Description (existing, add sub-topics)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000009', 'Collection and Classification', 'collection-classification', 1),
  ('11111111-0003-0000-0000-000000000009', 'Diagrammatic Representation', 'diagrammatic-representation', 2),
  ('11111111-0003-0000-0000-000000000009', 'Frequency Distribution', 'frequency-distribution', 3),
  ('11111111-0003-0000-0000-000000000009', 'Histogram and Ogive', 'histogram-ogive', 4)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Sampling
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000026', 'Sampling Principles', 'sampling-principles', 1),
  ('11111111-0003-0000-0000-000000000026', 'Probability vs Non-Probability Sampling', 'sampling-types', 2),
  ('11111111-0003-0000-0000-000000000026', 'Sampling Errors', 'sampling-errors', 3)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Central Tendency (existing, add sub-topics)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000010', 'Arithmetic Mean', 'arithmetic-mean', 1),
  ('11111111-0003-0000-0000-000000000010', 'Geometric and Harmonic Mean', 'geometric-harmonic-mean', 2),
  ('11111111-0003-0000-0000-000000000010', 'Median and Mode', 'median-mode', 3),
  ('11111111-0003-0000-0000-000000000010', 'Quartiles Deciles Percentiles', 'quartiles-deciles', 4)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Dispersion (existing, add sub-topics)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000011', 'Mean Deviation', 'mean-deviation', 1),
  ('11111111-0003-0000-0000-000000000011', 'Standard Deviation and Variance', 'std-deviation-variance', 2),
  ('11111111-0003-0000-0000-000000000011', 'Coefficient of Variation', 'coefficient-variation', 3)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Probability
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000027', 'Basic Probability Concepts', 'basic-probability', 1),
  ('11111111-0003-0000-0000-000000000027', 'Laws of Probability', 'laws-probability', 2),
  ('11111111-0003-0000-0000-000000000027', 'Conditional Probability', 'conditional-probability', 3),
  ('11111111-0003-0000-0000-000000000027', 'Bayes Theorem', 'bayes-theorem', 4)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Theoretical Distributions
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000028', 'Binomial Distribution', 'binomial-distribution', 1),
  ('11111111-0003-0000-0000-000000000028', 'Poisson Distribution', 'poisson-distribution', 2),
  ('11111111-0003-0000-0000-000000000028', 'Normal Distribution', 'normal-distribution', 3),
  ('11111111-0003-0000-0000-000000000028', 'Random Variables and Expectation', 'random-variables', 4)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Index Numbers (existing, add sub-topics)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000013', 'Methods of Index Numbers', 'methods-index-numbers', 1),
  ('11111111-0003-0000-0000-000000000013', 'Consumer Price Index', 'consumer-price-index', 2),
  ('11111111-0003-0000-0000-000000000013', 'Stock Market Indices', 'stock-market-indices', 3)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- PAPER 4: Expanded sub-topics
-- Intro Economics (existing, add sub-topics)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0004-0000-0000-000000000001', 'Meaning and Scope', 'meaning-scope-eco', 1),
  ('11111111-0004-0000-0000-000000000001', 'Basic Economic Problems', 'basic-eco-problems', 2),
  ('11111111-0004-0000-0000-000000000001', 'Role of Price Mechanism', 'price-mechanism', 3)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Demand Supply (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0004-0000-0000-000000000002', 'Indifference Curve Approach', 'indifference-curve', 4),
  ('11111111-0004-0000-0000-000000000002', 'Market Equilibrium', 'market-equilibrium', 5)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Production Cost (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0004-0000-0000-000000000003', 'Production Function', 'production-function', 1),
  ('11111111-0004-0000-0000-000000000003', 'Law of Variable Proportions', 'variable-proportions', 2),
  ('11111111-0004-0000-0000-000000000003', 'Returns to Scale', 'returns-to-scale', 3),
  ('11111111-0004-0000-0000-000000000003', 'Isoquants and Isocost', 'isoquants-isocost', 4),
  ('11111111-0004-0000-0000-000000000003', 'Short-run and Long-run Costs', 'short-long-run-costs', 5)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Price Determination (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0004-0000-0000-000000000004', 'Game Theory and Nash Equilibrium', 'game-theory', 5)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- National Income
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0004-0000-0000-000000000020', 'GDP GNP NDP NNP', 'gdp-gnp-ndp-nnp', 1),
  ('11111111-0004-0000-0000-000000000020', 'Measurement Methods', 'measurement-methods', 2),
  ('11111111-0004-0000-0000-000000000020', 'Keynesian Theory', 'keynesian-theory', 3),
  ('11111111-0004-0000-0000-000000000020', 'Multiplier Effect', 'multiplier-effect', 4)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Business Cycles (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0004-0000-0000-000000000005', 'Phases of Business Cycle', 'phases-business-cycle', 1),
  ('11111111-0004-0000-0000-000000000005', 'Causes and Features', 'causes-features-cycle', 2),
  ('11111111-0004-0000-0000-000000000005', 'Stabilization Policies', 'stabilization-policies', 3)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Public Finance
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0004-0000-0000-000000000021', 'Fiscal Functions', 'fiscal-functions', 1),
  ('11111111-0004-0000-0000-000000000021', 'Sources of Revenue', 'sources-revenue', 2),
  ('11111111-0004-0000-0000-000000000021', 'Budget and Expenditure', 'budget-expenditure', 3),
  ('11111111-0004-0000-0000-000000000021', 'Fiscal Policy and Deficit', 'fiscal-policy-deficit', 4),
  ('11111111-0004-0000-0000-000000000021', 'Public Debt Management', 'public-debt', 5)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Money Market
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0004-0000-0000-000000000022', 'Money Demand and Motives', 'money-demand', 1),
  ('11111111-0004-0000-0000-000000000022', 'Money Supply Components', 'money-supply', 2),
  ('11111111-0004-0000-0000-000000000022', 'Cryptocurrency and Digital Currency', 'crypto-digital', 3),
  ('11111111-0004-0000-0000-000000000022', 'Monetary Policy and RBI', 'monetary-policy-rbi', 4)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- International Trade
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0004-0000-0000-000000000023', 'Trade Theories', 'trade-theories', 1),
  ('11111111-0004-0000-0000-000000000023', 'Trade Policy Instruments', 'trade-policy', 2),
  ('11111111-0004-0000-0000-000000000023', 'WTO and Trade Negotiations', 'wto-negotiations', 3),
  ('11111111-0004-0000-0000-000000000023', 'Exchange Rates', 'exchange-rates', 4),
  ('11111111-0004-0000-0000-000000000023', 'Balance of Payments', 'balance-of-payments', 5),
  ('11111111-0004-0000-0000-000000000023', 'FDI and FPI', 'fdi-fpi', 6)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Indian Economy (expanded)
INSERT INTO sub_topics (topic_id, name, slug, sort_order) VALUES
  ('11111111-0004-0000-0000-000000000006', 'Pre-Independence Economy', 'pre-independence', 1),
  ('11111111-0004-0000-0000-000000000006', 'Planning Era 1950-1991', 'planning-era', 2),
  ('11111111-0004-0000-0000-000000000006', 'LPG Reforms 1991 Onwards', 'lpg-reforms', 3)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Create index for chapter lookups
CREATE INDEX IF NOT EXISTS idx_topics_chapter_id ON topics(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapters_paper_id ON chapters(paper_id);
