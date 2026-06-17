import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://xrqpszhccwafmscantvk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycXBzemhjY3dhZm1zY2FudHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNDIyNDAsImV4cCI6MjA4ODkxODI0MH0.NZID4kac880DjiIghbqrD0VeBGcV8AvZMFWCLqj4BIw');

async function test() {
  try {
    const { data, error } = await supabase.from('doctors').select('*');
    if (error) {
      console.log("Error querying doctors:", error);
      return;
    }
    
    console.log("Total doctors in DB:", data?.length);
    if (data?.length > 0) {
      console.log("\nSample doctors:", data.slice(0, 3).map(d => ({ 
        id: d.id, 
        specId: d.specialtyId || d['"specialtyId"'] || d.specialtyid || "NOT_FOUND"
      })));
      
      const counts = {};
      data.forEach(d => {
         const sid = d.specialtyId || d['"specialtyId"'] || d.specialtyid || 'undefined_field';
         counts[sid] = (counts[sid] || 0) + 1;
      });
      console.log("\nCounts per specialty:", counts);
    }
  } catch (e) {
    console.error(e)
  }
}
test();
