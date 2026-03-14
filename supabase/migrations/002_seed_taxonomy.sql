-- ============================================================
-- CA SAARTHI — TAXONOMY SEED DATA
-- Migration: 002_seed_taxonomy.sql
-- Based on ICAI CA Foundation syllabus
-- ============================================================

-- Papers
INSERT INTO papers (id, code, name, format, total_marks, duration_minutes, negative_marking, sort_order)
VALUES
  (1, 'P1', 'Principles & Practice of Accounting',            'descriptive', 100, 180, 0,    1),
  (2, 'P2', 'Business Laws & Business Correspondence',        'descriptive', 100, 180, 0,    2),
  (3, 'P3', 'Business Mathematics, Logical Reasoning & Stats','objective',   100, 135, 0.25, 3),
  (4, 'P4', 'Business Economics & Commercial Knowledge',      'objective',   100, 135, 0.25, 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PAPER 1 TOPICS
-- ============================================================
INSERT INTO topics (id, paper_id, name, slug, exam_weightage, sort_order) VALUES
  ('11111111-0001-0000-0000-000000000001', 1, 'Theoretical Framework',            'theoretical-framework',       8,  1),
  ('11111111-0001-0000-0000-000000000002', 1, 'Accounting Process',               'accounting-process',          12, 2),
  ('11111111-0001-0000-0000-000000000003', 1, 'Bank Reconciliation Statement',    'bank-reconciliation',         6,  3),
  ('11111111-0001-0000-0000-000000000004', 1, 'Inventories',                      'inventories',                 6,  4),
  ('11111111-0001-0000-0000-000000000005', 1, 'Depreciation & Amortisation',      'depreciation-amortisation',   8,  5),
  ('11111111-0001-0000-0000-000000000006', 1, 'Bills of Exchange',                'bills-of-exchange',           6,  6),
  ('11111111-0001-0000-0000-000000000007', 1, 'Final Accounts — Sole Proprietor', 'final-accounts-sole',         10, 7),
  ('11111111-0001-0000-0000-000000000008', 1, 'Not-for-Profit Organisations',     'not-for-profit',              8,  8),
  ('11111111-0001-0000-0000-000000000009', 1, 'Incomplete Records',               'incomplete-records',          6,  9),
  ('11111111-0001-0000-0000-000000000010', 1, 'Partnership Accounts',             'partnership-accounts',        16, 10),
  ('11111111-0001-0000-0000-000000000011', 1, 'Company Accounts',                 'company-accounts',            14, 11)
ON CONFLICT (paper_id, slug) DO NOTHING;

-- Paper 1 Sub-topics
INSERT INTO sub_topics (id, topic_id, name, slug, sort_order) VALUES
  -- Theoretical Framework
  ('21111111-0001-0001-0000-000000000001', '11111111-0001-0000-0000-000000000001', 'Accounting Concepts & Conventions', 'accounting-concepts', 1),
  ('21111111-0001-0001-0000-000000000002', '11111111-0001-0000-0000-000000000001', 'Accounting Standards Overview',     'accounting-standards', 2),
  ('21111111-0001-0001-0000-000000000003', '11111111-0001-0000-0000-000000000001', 'GAAP Principles',                   'gaap-principles',      3),
  -- Accounting Process
  ('21111111-0001-0002-0000-000000000001', '11111111-0001-0000-0000-000000000002', 'Journal Entries',                   'journal-entries',      1),
  ('21111111-0001-0002-0000-000000000002', '11111111-0001-0000-0000-000000000002', 'Ledger Posting',                    'ledger-posting',       2),
  ('21111111-0001-0002-0000-000000000003', '11111111-0001-0000-0000-000000000002', 'Trial Balance',                     'trial-balance',        3),
  ('21111111-0001-0002-0000-000000000004', '11111111-0001-0000-0000-000000000002', 'Subsidiary Books',                  'subsidiary-books',     4),
  -- Bank Reconciliation
  ('21111111-0001-0003-0000-000000000001', '11111111-0001-0000-0000-000000000003', 'BRS Preparation',                   'brs-preparation',      1),
  ('21111111-0001-0003-0000-000000000002', '11111111-0001-0000-0000-000000000003', 'Causes of Difference',              'causes-difference',    2),
  ('21111111-0001-0003-0000-000000000003', '11111111-0001-0000-0000-000000000003', 'Adjusted Cash Book',                'adjusted-cash-book',   3),
  -- Inventories
  ('21111111-0001-0004-0000-000000000001', '11111111-0001-0000-0000-000000000004', 'FIFO Method',                       'fifo-method',          1),
  ('21111111-0001-0004-0000-000000000002', '11111111-0001-0000-0000-000000000004', 'Weighted Average Method',           'weighted-average',     2),
  ('21111111-0001-0004-0000-000000000003', '11111111-0001-0000-0000-000000000004', 'NRV Concept',                       'nrv-concept',          3),
  -- Depreciation
  ('21111111-0001-0005-0000-000000000001', '11111111-0001-0000-0000-000000000005', 'Straight Line Method (SLM)',        'slm',                  1),
  ('21111111-0001-0005-0000-000000000002', '11111111-0001-0000-0000-000000000005', 'Written Down Value (WDV)',          'wdv',                  2),
  ('21111111-0001-0005-0000-000000000003', '11111111-0001-0000-0000-000000000005', 'Change in Method',                  'change-in-method',     3),
  -- Bills of Exchange
  ('21111111-0001-0006-0000-000000000001', '11111111-0001-0000-0000-000000000006', 'Promissory Notes',                  'promissory-notes',     1),
  ('21111111-0001-0006-0000-000000000002', '11111111-0001-0000-0000-000000000006', 'Dishonour & Renewal',               'dishonour-renewal',    2),
  ('21111111-0001-0006-0000-000000000003', '11111111-0001-0000-0000-000000000006', 'Accommodation Bills',               'accommodation-bills',  3),
  -- Final Accounts
  ('21111111-0001-0007-0000-000000000001', '11111111-0001-0000-0000-000000000007', 'Trading & P&L Account',             'trading-pl',           1),
  ('21111111-0001-0007-0000-000000000002', '11111111-0001-0000-0000-000000000007', 'Balance Sheet',                     'balance-sheet',        2),
  ('21111111-0001-0007-0000-000000000003', '11111111-0001-0000-0000-000000000007', 'Adjustments in Final Accounts',     'adjustments',          3),
  ('21111111-0001-0007-0000-000000000004', '11111111-0001-0000-0000-000000000007', 'Manufacturing Accounts',            'manufacturing-accts',  4),
  -- NPO
  ('21111111-0001-0008-0000-000000000001', '11111111-0001-0000-0000-000000000008', 'Receipts & Payments Account',       'receipts-payments',    1),
  ('21111111-0001-0008-0000-000000000002', '11111111-0001-0000-0000-000000000008', 'Income & Expenditure Account',      'income-expenditure',   2),
  -- Incomplete Records
  ('21111111-0001-0009-0000-000000000001', '11111111-0001-0000-0000-000000000009', 'Net Worth Method',                  'net-worth-method',     1),
  ('21111111-0001-0009-0000-000000000002', '11111111-0001-0000-0000-000000000009', 'Conversion Method',                 'conversion-method',    2),
  -- Partnership
  ('21111111-0001-0010-0000-000000000001', '11111111-0001-0000-0000-000000000010', 'Goodwill Treatment',                'goodwill-treatment',   1),
  ('21111111-0001-0010-0000-000000000002', '11111111-0001-0000-0000-000000000010', 'Admission of Partner',              'admission-partner',    2),
  ('21111111-0001-0010-0000-000000000003', '11111111-0001-0000-0000-000000000010', 'Retirement & Death of Partner',     'retirement-death',     3),
  ('21111111-0001-0010-0000-000000000004', '11111111-0001-0000-0000-000000000010', 'Dissolution of Firm',               'dissolution-firm',     4),
  -- Company Accounts
  ('21111111-0001-0011-0000-000000000001', '11111111-0001-0000-0000-000000000011', 'Share Issuance & Forfeiture',       'share-issuance',       1),
  ('21111111-0001-0011-0000-000000000002', '11111111-0001-0000-0000-000000000011', 'Debentures',                        'debentures',           2),
  ('21111111-0001-0011-0000-000000000003', '11111111-0001-0000-0000-000000000011', 'Bonus & Rights Issue',              'bonus-rights',         3)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- ============================================================
-- PAPER 2 TOPICS
-- ============================================================
INSERT INTO topics (id, paper_id, name, slug, exam_weightage, sort_order) VALUES
  ('11111111-0002-0000-0000-000000000001', 2, 'Indian Contract Act 1872',        'indian-contract-act',        20, 1),
  ('11111111-0002-0000-0000-000000000002', 2, 'Sale of Goods Act 1930',          'sale-of-goods-act',          10, 2),
  ('11111111-0002-0000-0000-000000000003', 2, 'Indian Partnership Act 1932',     'indian-partnership-act',     8,  3),
  ('11111111-0002-0000-0000-000000000004', 2, 'LLP Act 2008',                    'llp-act',                    5,  4),
  ('11111111-0002-0000-0000-000000000005', 2, 'Companies Act 2013',              'companies-act-2013',         12, 5),
  ('11111111-0002-0000-0000-000000000006', 2, 'Negotiable Instruments Act 1881', 'negotiable-instruments-act', 8,  6),
  ('11111111-0002-0000-0000-000000000007', 2, 'Indian Regulatory Framework',     'regulatory-framework',       5,  7),
  ('11111111-0002-0000-0000-000000000008', 2, 'Business Correspondence',         'business-correspondence',    15, 8),
  ('11111111-0002-0000-0000-000000000009', 2, 'Business Reporting',              'business-reporting',         10, 9)
ON CONFLICT (paper_id, slug) DO NOTHING;

INSERT INTO sub_topics (id, topic_id, name, slug, sort_order) VALUES
  -- Contract Act
  ('21111111-0002-0001-0000-000000000001', '11111111-0002-0000-0000-000000000001', 'Essential Elements of Contract', 'essential-elements',  1),
  ('21111111-0002-0001-0000-000000000002', '11111111-0002-0000-0000-000000000001', 'Offer & Acceptance',            'offer-acceptance',    2),
  ('21111111-0002-0001-0000-000000000003', '11111111-0002-0000-0000-000000000001', 'Consideration & Capacity',      'consideration',       3),
  ('21111111-0002-0001-0000-000000000004', '11111111-0002-0000-0000-000000000001', 'Void Agreements',               'void-agreements',     4),
  ('21111111-0002-0001-0000-000000000005', '11111111-0002-0000-0000-000000000001', 'Performance & Breach',          'performance-breach',  5),
  ('21111111-0002-0001-0000-000000000006', '11111111-0002-0000-0000-000000000001', 'Indemnity & Guarantee',         'indemnity-guarantee', 6),
  ('21111111-0002-0001-0000-000000000007', '11111111-0002-0000-0000-000000000001', 'Bailment, Pledge & Agency',     'bailment-agency',     7),
  -- Sale of Goods
  ('21111111-0002-0002-0000-000000000001', '11111111-0002-0000-0000-000000000002', 'Contract of Sale',              'contract-of-sale',    1),
  ('21111111-0002-0002-0000-000000000002', '11111111-0002-0000-0000-000000000002', 'Conditions & Warranties',       'conditions-warranties',2),
  ('21111111-0002-0002-0000-000000000003', '11111111-0002-0000-0000-000000000002', 'Transfer of Ownership',         'transfer-ownership',  3),
  ('21111111-0002-0002-0000-000000000004', '11111111-0002-0000-0000-000000000002', 'Unpaid Seller Rights',          'unpaid-seller',       4),
  -- Partnership Act
  ('21111111-0002-0003-0000-000000000001', '11111111-0002-0000-0000-000000000003', 'Nature of Partnership',         'nature-partnership',  1),
  ('21111111-0002-0003-0000-000000000002', '11111111-0002-0000-0000-000000000003', 'Rights & Duties of Partners',   'rights-duties',       2),
  ('21111111-0002-0003-0000-000000000003', '11111111-0002-0000-0000-000000000003', 'Dissolution of Partnership',    'dissolution',         3),
  -- Correspondence
  ('21111111-0002-0008-0000-000000000001', '11111111-0002-0000-0000-000000000008', 'Letter Writing',                'letter-writing',      1),
  ('21111111-0002-0008-0000-000000000002', '11111111-0002-0000-0000-000000000008', 'Email Drafting',                'email-drafting',      2),
  ('21111111-0002-0008-0000-000000000003', '11111111-0002-0000-0000-000000000008', 'Report & Précis Writing',       'report-precis',       3),
  -- Reporting
  ('21111111-0002-0009-0000-000000000001', '11111111-0002-0000-0000-000000000009', 'Business Reports',              'business-reports',    1),
  ('21111111-0002-0009-0000-000000000002', '11111111-0002-0000-0000-000000000009', 'Minutes, Notices & Agenda',     'minutes-notices',     2)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- ============================================================
-- PAPER 3 TOPICS
-- ============================================================
INSERT INTO topics (id, paper_id, name, slug, exam_weightage, sort_order) VALUES
  ('11111111-0003-0000-0000-000000000001', 3, 'Ratio, Proportion & Indices',        'ratio-proportion-indices',  6,  1),
  ('11111111-0003-0000-0000-000000000002', 3, 'Logarithm',                          'logarithm',                 4,  2),
  ('11111111-0003-0000-0000-000000000003', 3, 'Linear Inequalities',                'linear-inequalities',       4,  3),
  ('11111111-0003-0000-0000-000000000004', 3, 'Time Value of Money',                'time-value-money',          10, 4),
  ('11111111-0003-0000-0000-000000000005', 3, 'Permutations & Combinations',        'permutations-combinations', 8,  5),
  ('11111111-0003-0000-0000-000000000006', 3, 'Sequence, Series & Sets',            'sequence-series-sets',      6,  6),
  ('11111111-0003-0000-0000-000000000007', 3, 'Limits, Functions & Differential Calculus', 'calculus',           6,  7),
  ('11111111-0003-0000-0000-000000000008', 3, 'Logical Reasoning',                  'logical-reasoning',         10, 8),
  ('11111111-0003-0000-0000-000000000009', 3, 'Statistical Description of Data',    'statistical-description',   6,  9),
  ('11111111-0003-0000-0000-000000000010', 3, 'Measures of Central Tendency',       'central-tendency',          8,  10),
  ('11111111-0003-0000-0000-000000000011', 3, 'Measures of Dispersion',             'dispersion',                8,  11),
  ('11111111-0003-0000-0000-000000000012', 3, 'Correlation & Regression',           'correlation-regression',    10, 12),
  ('11111111-0003-0000-0000-000000000013', 3, 'Index Numbers & Time Series',        'index-numbers-time-series', 8,  13)
ON CONFLICT (paper_id, slug) DO NOTHING;

INSERT INTO sub_topics (id, topic_id, name, slug, sort_order) VALUES
  ('21111111-0003-0004-0000-000000000001', '11111111-0003-0000-0000-000000000004', 'Simple & Compound Interest',    'simple-compound-interest', 1),
  ('21111111-0003-0004-0000-000000000002', '11111111-0003-0000-0000-000000000004', 'EMI Calculations',              'emi',                      2),
  ('21111111-0003-0004-0000-000000000003', '11111111-0003-0000-0000-000000000004', 'Annuities',                     'annuities',                3),
  ('21111111-0003-0004-0000-000000000004', '11111111-0003-0000-0000-000000000004', 'Present & Future Value',        'pv-fv',                    4),
  ('21111111-0003-0005-0000-000000000001', '11111111-0003-0000-0000-000000000005', 'Fundamental Counting Principle','fundamental-principle',    1),
  ('21111111-0003-0005-0000-000000000002', '11111111-0003-0000-0000-000000000005', 'Permutations (nPr)',            'permutations-npr',         2),
  ('21111111-0003-0005-0000-000000000003', '11111111-0003-0000-0000-000000000005', 'Combinations (nCr)',            'combinations-ncr',         3),
  ('21111111-0003-0008-0000-000000000001', '11111111-0003-0000-0000-000000000008', 'Number & Letter Series',        'number-letter-series',     1),
  ('21111111-0003-0008-0000-000000000002', '11111111-0003-0000-0000-000000000008', 'Coding-Decoding',               'coding-decoding',          2),
  ('21111111-0003-0008-0000-000000000003', '11111111-0003-0000-0000-000000000008', 'Blood Relations',               'blood-relations',          3),
  ('21111111-0003-0008-0000-000000000004', '11111111-0003-0000-0000-000000000008', 'Direction Sense',               'direction-sense',          4),
  ('21111111-0003-0008-0000-000000000005', '11111111-0003-0000-0000-000000000008', 'Seating Arrangement',           'seating-arrangement',      5),
  ('21111111-0003-0012-0000-000000000001', '11111111-0003-0000-0000-000000000012', 'Karl Pearson Correlation',      'karl-pearson',             1),
  ('21111111-0003-0012-0000-000000000002', '11111111-0003-0000-0000-000000000012', 'Spearman Rank Correlation',     'spearman-rank',            2),
  ('21111111-0003-0012-0000-000000000003', '11111111-0003-0000-0000-000000000012', 'Regression Lines',              'regression-lines',         3)
ON CONFLICT (topic_id, slug) DO NOTHING;

-- ============================================================
-- PAPER 4 TOPICS
-- ============================================================
INSERT INTO topics (id, paper_id, name, slug, exam_weightage, sort_order) VALUES
  ('11111111-0004-0000-0000-000000000001', 4, 'Introduction to Business Economics', 'intro-economics',        8,  1),
  ('11111111-0004-0000-0000-000000000002', 4, 'Theory of Demand & Supply',         'demand-supply',          15, 2),
  ('11111111-0004-0000-0000-000000000003', 4, 'Theory of Production & Cost',       'production-cost',        12, 3),
  ('11111111-0004-0000-0000-000000000004', 4, 'Price Determination',               'price-determination',    10, 4),
  ('11111111-0004-0000-0000-000000000005', 4, 'Business Cycles',                   'business-cycles',        8,  5),
  ('11111111-0004-0000-0000-000000000006', 4, 'Indian Economic Development',       'indian-economic-dev',    15, 6),
  ('11111111-0004-0000-0000-000000000007', 4, 'Business & Commercial Knowledge',   'business-commercial',    20, 7)
ON CONFLICT (paper_id, slug) DO NOTHING;

INSERT INTO sub_topics (id, topic_id, name, slug, sort_order) VALUES
  ('21111111-0004-0002-0000-000000000001', '11111111-0004-0000-0000-000000000002', 'Law of Demand & Elasticity',    'demand-elasticity',        1),
  ('21111111-0004-0002-0000-000000000002', '11111111-0004-0000-0000-000000000002', 'Consumer Equilibrium',          'consumer-equilibrium',     2),
  ('21111111-0004-0002-0000-000000000003', '11111111-0004-0000-0000-000000000002', 'Law of Supply & Market Equil.', 'supply-equilibrium',       3),
  ('21111111-0004-0004-0000-000000000001', '11111111-0004-0000-0000-000000000004', 'Perfect Competition',           'perfect-competition',      1),
  ('21111111-0004-0004-0000-000000000002', '11111111-0004-0000-0000-000000000004', 'Monopoly',                      'monopoly',                 2),
  ('21111111-0004-0004-0000-000000000003', '11111111-0004-0000-0000-000000000004', 'Monopolistic Competition',      'monopolistic-competition', 3),
  ('21111111-0004-0004-0000-000000000004', '11111111-0004-0000-0000-000000000004', 'Oligopoly',                     'oligopoly',                4),
  ('21111111-0004-0007-0000-000000000001', '11111111-0004-0000-0000-000000000007', 'Forms of Business Organisation','forms-business-org',       1),
  ('21111111-0004-0007-0000-000000000002', '11111111-0004-0000-0000-000000000007', 'Banking & Insurance',           'banking-insurance',        2),
  ('21111111-0004-0007-0000-000000000003', '11111111-0004-0000-0000-000000000007', 'E-Commerce & Trade',            'ecommerce-trade',          3)
ON CONFLICT (topic_id, slug) DO NOTHING;
