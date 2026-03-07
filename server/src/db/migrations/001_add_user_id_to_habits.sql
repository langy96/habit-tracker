-- Add ownership column for existing databases created before auth.
ALTER TABLE habits
ADD COLUMN IF NOT EXISTS user_id INT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'habits_user_id_fkey'
      AND table_name = 'habits'
  ) THEN
    ALTER TABLE habits
    ADD CONSTRAINT habits_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;
  END IF;
END $$;
