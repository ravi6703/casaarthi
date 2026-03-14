import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://cmjbarwlzxalnzjoeosr.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Test 1: Signup
console.log('🧪 Testing signup...');
const { data, error } = await s.auth.signUp({
  email: 'final_test@example.com',
  password: 'test123456',
  options: { data: { full_name: 'Final Test' } },
});

if (error) {
  console.log('❌ Signup failed:', error.message);
} else {
  const hasSession = data.session !== null;
  console.log(`✅ Signup: session=${hasSession}, confirmed=${!!data.user?.email_confirmed_at}`);
  if (hasSession) {
    console.log('🎉 Signup works perfectly — session created immediately!');
  } else {
    console.log('⚠️  No session — email confirmation may still be enabled');
  }
  // Cleanup
  if (data.user) {
    await s.auth.admin.deleteUser(data.user.id);
    console.log('🧹 Test user cleaned up');
  }
}

// Test 2: Verify seeded data
const [p, t, st] = await Promise.all([
  s.from('papers').select('code, name'),
  s.from('topics').select('*', { count: 'exact', head: true }),
  s.from('sub_topics').select('*', { count: 'exact', head: true }),
]);
console.log('\n📊 Seeded data:');
p.data?.forEach(paper => console.log(`   ${paper.code}: ${paper.name}`));
console.log(`   Topics: ${t.count} | Sub-topics: ${st.count}`);
