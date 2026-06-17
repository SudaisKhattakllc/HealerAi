-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO FIX THE "FAILED TO DELETE" ERROR

-- This updates the foreign key so that if you delete a user in the Authentication tab,
-- it will automatically delete their matching profile in the profiles table!
ALTER TABLE profiles
DROP CONSTRAINT profiles_id_fkey,
ADD CONSTRAINT profiles_id_fkey
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
