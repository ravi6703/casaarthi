import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://cmjbarwlzxalnzjoeosr.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const [p, t, st] = await Promise.all([
  s.from('papers').select('*', { count: 'exact', head: true }),
  s.from('topics').select('*', { count: 'exact', head: true }),
  s.from('sub_topics').select('*', { count: 'exact', head: true }),
]);
console.log(`Papers: ${p.count} | Topics: ${t.count} | Sub-topics: ${st.count}`);

// Test signup
const { data, error } = await s.auth.signUp({
  email: 'test_verify_signup@example.com',
  password: 'test123456',
  options: { data: { full_name: 'Test Verify' } },
});

if (error) {
  console.log('Signup error:', error.message);
} else {
  const hasSession = data.session !== null;
  const confirmed = data.user?.email_confirmed_at !== null;
  console.log(`Signup test: session=${hasSession}, confirmed=${confirmed}`);
  if (!hasSession) {
    console.log('⚠️  Email confirmation is ENABLED — users cannot login after signup!');
    console.log('   Fix: Supabase → Auth → Providers → Email → disable "Confirm email"');
  } else {
    console.log('✅ Signup works — session created immediately');
  }
  // Cleanup
  if (data.user) {
    await s.auth.admin.deleteUser(data.user.id);
    console.log('🧹 Cleaned up test user');
  }
}
