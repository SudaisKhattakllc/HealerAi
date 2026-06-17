import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://xrqpszhccwafmscantvk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycXBzemhjY3dhZm1zY2FudHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNDIyNDAsImV4cCI6MjA4ODkxODI0MH0.NZID4kac880DjiIghbqrD0VeBGcV8AvZMFWCLqj4BIw');

async function test() {
  console.log("Testing doctors query...");
  const { data: allDocs, error: err1 } = await supabase.from('doctors').select('*').limit(1);
  console.log("All doctors result:", JSON.stringify(allDocs), err1);

  const { data: neur, error: err2 } = await supabase.from('doctors').select('*').eq('specialtyId', 'neurology').limit(1);
  console.log("Neurology normal eq:", JSON.stringify(neur), err2);

  const { data: neurQuote, error: err3 } = await supabase.from('doctors').select('*').eq('"specialtyId"', 'neurology').limit(1);
  console.log("Neurology quoted eq:", JSON.stringify(neurQuote), err3);
  
  // also check if "specialtyid" lowercase works
  const { data: neurLower, error: err4 } = await supabase.from('doctors').select('*').eq('specialtyid', 'neurology').limit(1);
  console.log("Neurology lowercase:", JSON.stringify(neurLower), err4);
}

test();
